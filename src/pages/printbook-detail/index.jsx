import Taro, { Component } from "@tarojs/taro";
import { View, Block } from "@tarojs/components";
import { AtMessage, AtActivityIndicator, AtButton, AtFloatLayout, AtTextarea } from "taro-ui";

import URL from "../../constants/urls";
import API from '../../services/api';
import NetworkError from "../../components/network-error";
import HorizonList from "../../components/horizon-list";
import BookPreviewHeader from "../../components/book-preview-header";
import user from '../../services/user';
import { setGlobalData } from '../../services/global_data';

import "./index.scss";

export default class PrintBookDetail extends Component {

  constructor() {
    super(...arguments);

    this.onReload = this.onReload.bind(this);
  }

  state = {
    book: {},
    isFetching: true,
    isError: false,
    mainButton: null,
    isApplyFloatLayoutOpened: false
  };

  componentDidMount() {
    this.loadBook();
  }

  onReload() {
    this.loadBook();
  }

  loadBook() {
    let book_id = this.$router.params.id;
    API.get(`/print_books/${book_id}`).then(res => {
      console.log(res.data)
      let printBook = res.data['print_book'];
      let mainButton = this.getMainButton(printBook);
      this.setState({
        book: printBook,
        isFetching: false,
        isError: false,
        mainButton: mainButton
      });
    }).catch(err => {
      console.error(err);
    });
  }

  getMainButton(book) {
    let mainButton = {enabled: true, visible: true};

    if (!user) { /* no login */
      mainButton.visible = false;
    } else if (book.owner_id == user.userId) {
      if (book.property == 'personal') {
        mainButton.text = '共享/借出';
        mainButton.onClick = this.onClickSetProperty.bind(this);
      } else {
        mainButton.text = '撤回/修改';
        mainButton.onClick = this.onClickSetProperty.bind(this);
      }
    } else {
      if (book.property == 'personal') {
        mainButton.visible = false;
      } else {
        mainButton.text = '预约申请';
        mainButton.onClick = this.onClickApply.bind(this);
      }
    }

    return mainButton;
  }

  onClickSetProperty() {
    setGlobalData('book', this.state.book);
    Taro.navigateTo({'url': `${URL.PRINT_BOOK_PROPERTY}?id=${this.state.book.id}`});
  }

  onClickApply() {
    this.setState({
      isApplyFloatLayoutOpened: true
    })
  }

  onRequestBook() {
    let requestType = '';
    if (this.state.book.property == 'borrowable') {
      requestType = 'borrowings';
    } else if (this.state.book.property == 'shared') {
      requestType = 'sharings';
    } else {
      Taro.atMessage({
        'message': '预约成功！',
        'type': 'warn',
      });
    }
    
    API.post(`/${requestType}`, { 'print_book_id': this.state.book.id, 
      'application_reason': this.state.applicationReason }).then(res => {
      console.log(res.data)
      Taro.atMessage({
        'message': '预约成功！',
        'type': 'success',
      });
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      this.setState({
        isApplyFloatLayoutOpened: false
      });
    });
  }

  onApplicationReasonChange(e) {
    this.setState({
      applicationReason: e.target.value
    })
  }

  onShareAppMessage (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    let id = this.$router.params.id;
    return {
      title: '共享图书馆',
      path: `pages/printbook-detail/index?id=${id}`
    }
  }

  config = {
    navigationBarTitleText: "藏书详情"
  };

  render() {
    const { book, isFetching, isError, mainButton } = this.state;
    return (
      <View>
        <AtMessage />

        {!isFetching && !isError && (
          <Block>
            <BookPreviewHeader book={book.book} />

            <View className='book-extra'>
              <View className='book-extra__title'>藏书信息</View>
              <View className='at-col book-extra__info'>
                <View>藏书持有人：{book.holder.nickname}</View>
                <View>藏书位置：{book.region.province['name']} {book.region.city['name']} {book.region.district['name']}</View>
              </View>
            </View>

            <View className='book-introduction'>
              <View className='book-introduction__title'>简介与目录</View>
              <View className='book-introduction__content'>
                {book.book.summary}
              </View>
            </View>
            { book.description && (
              <View className='book-introduction'>
                <View className='book-introduction__title'>藏书备注</View>
                <View className='book-introduction__content'>
                  {book.description}
                </View>
              </View>
            )}
            <View className='related-books'>
              <View className='related-books__title'>相关图书</View>
              <View className='related-books__content'>
                <HorizonList data={book.related_books} sideSpace={32} />
              </View>
            </View>
          </Block>
        )}
        {mainButton && mainButton.visible && (
          <AtButton type='primary' onClick={mainButton.onClick} >{mainButton.text}</AtButton>
        )}
        <AtFloatLayout isOpened={this.state.isApplyFloatLayoutOpened} title='预约借书' >
          <AtTextarea
            value={this.state.value}
            onChange={this.onApplicationReasonChange.bind(this)}
            maxLength={1024}
            height={400}
            placeholder='添加预约图书的理由...'
          />
          <AtButton type='primary' onClick={this.onRequestBook.bind(this)}>申请预约</AtButton> 
        </AtFloatLayout>
        {isFetching && (
          <AtActivityIndicator mode='center' content='加载中...' />
        )}
        {isError && <NetworkError onClick={this.onReload} />}
      </View>
    );
  }
}
