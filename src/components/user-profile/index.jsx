import Taro, { Component } from "@tarojs/taro";
import { View, Navigator, Image, Text } from "@tarojs/components";
import PropTypes from "prop-types";
import { AtAvatar } from 'taro-ui';

import "./index.scss";

export default class UserProfile extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    userInfo: {},
    showArrow: true
  };

  render() {
    const { userInfo } = this.props;
    return (
      <View
        className='at-row at-row__align--start user-profile'
        hoverClass='None'
      >
        <View className='at-col user-profile__avatar'>
          <AtAvatar circle size='normal' text='书'></AtAvatar>
        </View>
        <View className='at-col user-profile__info'>
          <View className='user-profile__info-name'>{userInfo.nickName}</View>
        </View>
        {/* {showArrow && (
          <Text
            className='at-icon at-icon-chevron-right panel-header__arrow at-col at-col-1 at-col--auto'
            style={{ alignSelf: "center" }}
          />
        )} */}
      </View>
    );
  }
}
