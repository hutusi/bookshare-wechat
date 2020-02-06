import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text, Block } from "@tarojs/components";
import { AtActivityIndicator, AtButton } from "taro-ui";
import moment from 'moment';

import URL from "../../constants/urls";
import API from '../../services/api';
import NetworkError from "../../components/network-error";
import HorizonList from "../../components/horizon-list";
import user from '../../services/user';
import { setGlobalData } from '../../services/global_data';

import "./index.scss";

export default class PrintBookDetail extends Component {

  constructor() {
    super(...arguments);
    this.onPreview = this.onPreview.bind(this);
    this.onReload = this.onReload.bind(this);
  }

  state = {
    book: {},
    isFetching: true,
    isError: false,
    mainButton: null
  };

  componentDidMount() {
    this.loadBook();
  }

  onReload() {
    this.loadBook();
  }

  onPreview() {
    let { cover } = this.state.book.book;
    Taro.previewImage({
      current: cover,
      urls: [cover]
    });
  }

  loadBook() {
    let book_id = this.$router.params.id
    API.get(`/print_books/${book_id}`).then(res => {
      // console.log(res.data)
      let mainButton = this.getMainButton(res.data);
      this.setState({
        book: res.data,
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

    if (book.owner_id == user.userId) {
      if (book.property == 'personal') {
        mainButton.text = '共享/借出';
        mainButton.onClick = this.onClickSetProperty.bind(this);
      } else {
        mainButton.text = '撤回/修改';
        mainButton.onClick = this.onClickSetProperty.bind(this);
      }
    } else {
      mainButton.visible = false;
    }

    return mainButton;
  }

  onClickSetProperty() {
    setGlobalData('book', this.state.book);
    Taro.navigateTo({'url': `${URL.PRINT_BOOK_PROPERTY}?id=${this.state.book.id}`});
  }

  config = {
    navigationBarTitleText: "藏书详情"
  };

  render() {
    const { book, isFetching, isError, mainButton } = this.state;
    return (
      <View>
        {!isFetching && !isError && (
          <Block>
            <View className='at-row at-row__align--start book'>
              <View className='at-col book__info'>
                <View className='book__info-title'>{book.book.title}</View>
                <View>作者：{book.book.author_name}</View>
                <View>出版社：{book.book.publisher_name}</View>
                <View>出版日期：{moment(book.book.pubdate).format('YYYY-MM-DD')}</View>
                <View>ISBN：{book.book.isbn}</View>
                <View>状态：{book.status}</View>
              </View>
              <Image
                className='at-col at-col--auto book__img'
                src={book.book.cover}
                mode='widthFix'
                onClick={this.onPreview}
              />
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
        {isFetching && (
          <AtActivityIndicator mode='center' content='加载中...' />
        )}
        {isError && <NetworkError onClick={this.onReload} />}
      </View>
    );
  }
}
