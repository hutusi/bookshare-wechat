import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtMessage } from 'taro-ui';
import moment from 'moment';

import "./index.scss";

export default class BookPreviewHeader extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    book: {}
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  handlePreview(cover) {
    Taro.previewImage({
      current: cover,
      urls: [cover]
    });
  }

  render() {
    const { book } = this.props;
    return (
      <View className='at-row at-row__align--start book'>
        <View className='at-col book__info'>
          <View className='book__info-title'>{book.title}</View>
          <View>作者：{book.author_name}</View>
          {book.translator_name &&
            <View>译者：{book.translator_name}</View>
          }
          <View>出版社：{book.publisher_name}</View>
          <View>出版日期：{moment(book.pubdate).format('YYYY-MM-DD')}</View>
          {book.series_name &&
            <View>系列：{book.series_name}</View>
          }
          <View>ISBN：{book.isbn}</View>
        </View>
        <Image
          className='at-col at-col--auto book__img'
          src={book.cover}
          mode='widthFix'
          onClick={this.handlePreview.bind(this, book.cover)}
        />
      </View>
    );
  }
}
