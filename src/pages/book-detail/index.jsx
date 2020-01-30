import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text, Block } from "@tarojs/components";
import { AtActivityIndicator } from "taro-ui";
import moment from 'moment';

import API from '../../services/api';
import NetworkError from "../../components/network-error";
import HorizonList from "../../components/horizon-list";

import "./index.scss";

export default class BookDetail extends Component {

  constructor() {
    super(...arguments);
    this.onPreview = this.onPreview.bind(this);
    this.onReload = this.onReload.bind(this);
  }

  state = {
    book: {},
    isFetching: true,
    isError: false
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
    API.get(`/books/${book_id}`)
           .then(res => {
              console.log(res.data)
              this.setState({
                book: res.data,
                isFetching: false,
                isError: false
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
    const { book, isFetching, isError } = this.state;
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
