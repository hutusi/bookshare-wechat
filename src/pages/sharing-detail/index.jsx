import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text, Block, Label } from "@tarojs/components";
import { AtForm, AtRadio, AtButton, AtTextarea } from "taro-ui";
import moment from 'moment';

import API from '../../services/api';
import user from '../../services/user';

import "./index.scss";

export default class SharingDetail extends Component {
  constructor() {
    super(...arguments);
    this.onPreview = this.onPreview.bind(this);
    this.fetchInfo = this.fetchInfo.bind(this);
  }

  state = {
  };

  componentWillMount () {
    this.fetchInfo();
  }

  componentDidMount() {
  }

  fetchInfo() {
    let sharingId = this.$router.params.id;

    API.get(`/sharings/${sharingId}`).then(res => {
      console.log(res)
      this.setState(res.data);
    }).catch(err => {
      console.error(err);
    });
  }

  onPreview() {
    let { cover } = this.state.book.book;
    Taro.previewImage({
      current: cover,
      urls: [cover]
    });
  }

  config = {
    navigationBarTitleText: "藏书信息修改"
  };

  render() {
    const { book, status } = this.state;

    return (
      <View>
        {book && (
          <Block>
            <View className='at-row at-row__align--start book'>
              <View className='at-col book__info'>
                <View className='book__info-title'>{book.title}</View>
                <View>作者：{book.author_name}</View>
                <View>出版社：{book.publisher_name}</View>
                <View>出版日期：{moment(book.pubdate).format('YYYY-MM-DD')}</View>
                <View>ISBN：{book.isbn}</View>
                <View>状态：{status}</View>
              </View>
              <Image
                className='at-col at-col--auto book__img'
                src={book.cover}
                mode='widthFix'
                onClick={this.onPreview}
              />
            </View>

            
          </Block>
        )}
      </View>
    );
  }
}
