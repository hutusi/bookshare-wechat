import Taro, { Component } from "@tarojs/taro";
import { View, Navigator, Image, Text } from "@tarojs/components";
import PropTypes from "prop-types";
import moment from 'moment';

import URL from "../../constants/urls";
import "./index.scss";

export default class PrintBookCard extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    data: {},
    showArrow: true,
    onLongPress: () => {}
  };

  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string,
      author_name: PropTypes.string,
      cover: PropTypes.string
    }),
    showArrow: PropTypes.bool,
    onLongPress: PropTypes.func
  };

  onLongPress() {
    this.props.onLongPress(this.state.data.id);
  }

  render() {
    const { data, showArrow } = this.props;
    return (
      <Navigator
        className='at-row at-row__align--start my-book-card'
        hoverClass='None'
        url={`${URL.PRINT_BOOK_DETAIL}?id=${data.id}`}
      >
        <Image
          className='at-col at-col--auto my-book-card__img'
          style={{ marginRight: Taro.pxTransform(24) }}
          src={data.book.cover}
          mode='aspectFill'
        />
        <View className='at-col my-book-card__info'>
          <View className='my-book-card__info-title'>{data.book.title}</View>
          <View>作者：{data.book.author_name}</View>
          <View>出版社：{data.book.publisher_name}</View>
          <View>出版日期：{moment(data.book.pubdate).format('YYYY-MM-DD')}</View>
          <View>ISBN：{data.book.isbn}</View>
          <View>状态：{data.status}</View>
        </View>
        {showArrow && (
          <Text
            className='at-icon at-icon-chevron-right panel-header__arrow at-col at-col-1 at-col--auto'
            style={{ alignSelf: "center" }}
          />
        )}
      </Navigator>
    );
  }
}