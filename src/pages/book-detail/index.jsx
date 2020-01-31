import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text, Block } from "@tarojs/components";
import { AtActivityIndicator, AtButton, AtFloatLayout, AtTextarea } from "taro-ui";
import moment from 'moment';

import API from '../../services/api';
import NetworkError from "../../components/network-error";
import HorizonList from "../../components/horizon-list";

import "./index.scss";
import user from "../../services/user";

export default class BookDetail extends Component {

  constructor() {
    super(...arguments);
    this.onPreview = this.onPreview.bind(this);
    this.onReload = this.onReload.bind(this);
    this.onPopUp = this.onPopUp.bind(this);
    this.ownBook = this.ownBook.bind(this);
  }

  state = {
    book: {},
    isFetching: true,
    isError: false,
    printBooksTotal: 0,
    isFloatLayoutOpened: false,
    book_description: ''
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
    let bookId = this.$router.params.id
    API.get(`/books/${bookId}`)
           .then(res => {
              console.log(res.data)
              this.setState({
                book: res.data,
                isFetching: false,
                isError: false
              })
        })

    API.get('/print_books/search_by', { 'book_id': bookId, 'owner_id': user.userId })
        .then(res => {
           console.log(res.data)
           this.setState({
             printBooks: res.data['print_books'],
             printBooksTotal: res.data['total']
           })
     })
  }

  onPopUp() {
    this.setState({
      isFloatLayoutOpened: true
    })
  }

  ownBook() {
    API.post('/print_books', { 'book_id': this.state.book.id, 'description': this.state.book_description })
        .then(res => {
          console.log(res)
          this.setState({
            printBooksTotal: 1,
            isFloatLayoutOpened: false
          })
     })
  }

  // async loadBook() {
  //   try {
  //     let book;
  //     let book_id = this.$router.params.id
  //     book = await API.get(`/print_books/${book_id}`);
  //     console.log(book)
  //     this.setState({
  //       book,
  //       isFetching: false,
  //       isError: false
  //     });
  //   } catch (e) {
  //     this.setState({
  //       isFetching: false,
  //       isError: true
  //     });
  //   }
  // }

  config = {
    navigationBarTitleText: "图书详情"
  };

  render() {
    const { book, isFetching, isError, printBooksTotal, isFloatLayoutOpened } = this.state;
    return (
      <View>
        {!isFetching && !isError && (
          <Block>
            <View className='at-row at-row__align--start book'>
              <View className='at-col book__info'>
                <View className='book__info-title'>{book.title}</View>
                <View>作者：{book.author_name}</View>
                <View>出版社：{book.publisher_name}</View>
                <View>出版日期：{moment(book.pubdate).format('YYYY-MM-DD')}</View>
                <View>ISBN：{book.isbn}</View>
              </View>
              <Image
                className='at-col at-col--auto book__img'
                src={book.cover}
                mode='widthFix'
                onClick={this.onPreview}
              />
            </View>
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

            { printBooksTotal <= 0 && (
              <AtButton type='primary' onClick={this.onPopUp}>拥有此书</AtButton> 
            )}

            <AtFloatLayout isOpened={isFloatLayoutOpened} title='添加图书' >
              <AtTextarea
                value={this.state.book_description}
                maxLength={1024}
                height={400}
                placeholder='添加备注...'
              />
              <AtButton type='primary' onClick={this.ownBook}>拥有此书</AtButton> 
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
