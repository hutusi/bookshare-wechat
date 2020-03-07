import Taro, { Component } from "@tarojs/taro";
import { View, Block } from "@tarojs/components";
import { AtActivityIndicator, AtButton, AtFloatLayout, AtTextarea } from "taro-ui";

import API from '../../services/api';
import NetworkError from "../../components/network-error";
import HorizonList from "../../components/horizon-list";

import BookPreviewHeader from "../../components/book-preview-header";
import user from "../../services/user";

import "./index.scss";

export default class BookDetail extends Component {

  constructor() {
    super(...arguments);
    this.onReload = this.onReload.bind(this);
    this.onPopUp = this.onPopUp.bind(this);
    this.ownBook = this.ownBook.bind(this);
  }

  state = {
    book: {},
    ownedPrintBooks: [],
    isFetching: true,
    isError: false,
    isFloatLayoutOpened: false,
    book_description: ''
  };

  componentDidMount() {
    this.loadBook();
  }

  onReload() {
    this.loadBook();
  }

  loadBook() {
    let bookId = this.$router.params.id
    API.get(`/books/${bookId}`).then(res => {
      console.log(res.data)
      let book = res.data['book'];
      this.setState({
        book: book,
        ownedPrintBooks: book.owned_print_books,
        isFetching: false,
        isError: false
      });
    }).catch(err => {
      console.error(err);
    });
  }

  onPopUp() {
    this.setState({
      isFloatLayoutOpened: true
    })
  }

  ownBook() {
    // console.log('book description :', this.state.book_description);
    API.post('/print_books', { 'book_id': this.state.book.id, 
      'description': this.state.book_description }).then(res => {
      // console.log(res)
      let print_book = res.data['print_book'];
      let ownedPrintBooks = [ print_book ];
      this.setState({
        ownedPrintBooks: ownedPrintBooks,
        isFloatLayoutOpened: false
      });
    }).catch(err => {
      console.error(err);
    });
  }

  bookDescInputHandler(e) {
    this.setState({
      book_description: e.target.value
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
      path: `pages/book-detail/index?id=${id}`
    }
  }

  config = {
    navigationBarTitleText: "图书详情"
  };

  render() {
    const { book, isFetching, isError, ownedPrintBooks, isFloatLayoutOpened } = this.state;
    return (
      <View>
        {!isFetching && !isError && (
          <Block>
            <BookPreviewHeader book={book} />

            <View className='book-introduction'>
              <View className='book-introduction__title'>简介与目录</View>
              <View className='book-introduction__content'>
                {book.summary}
              </View>
            </View>
            <View className='related-books'>
              <View className='related-books__title'>相关图书</View>
              <View className='related-books__content'>
                <HorizonList data={book.related_books} sideSpace={32} />
              </View>
            </View>

            { ownedPrintBooks.length <= 0 && (
              <AtButton type='primary' onClick={this.onPopUp}>拥有此书</AtButton> 
            )}

            <AtFloatLayout isOpened={isFloatLayoutOpened} title='添加图书' >
              <AtTextarea
                value={this.state.book_description}
                onChange={this.bookDescInputHandler.bind(this)}
                maxLength={1024}
                height={400}
                placeholder='添加备注...'
              />
              <AtButton type='primary' onClick={this.ownBook}>我有此书</AtButton> 
            </AtFloatLayout>
          </Block>
        )}
        {isFetching && (
          <AtActivityIndicator mode='center' content='加载中...' />
        )}
        {isError && <NetworkError onClick={this.onReload} />}
      </View>
    );
  }
}
