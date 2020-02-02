import Taro, { Component } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { AtActionSheet, AtActionSheetItem } from 'taro-ui';

import "./index.scss";

export default class AuthActionSheet extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    isAuthNeeded: false
  };

  constructor(props) {
    super(props);

    this.onGetUserInfo = this.onGetUserInfo.bind(this);
  }

  componentWillMount() {
  }

  onGetUserInfo(e) {
    e.stopPropagation()
  }

  render() {
    const { isAuthNeeded } = this.props;
    return (
      <AtActionSheet isOpened={isAuthNeeded}>
        <AtActionSheetItem>
          <Button className='btn-max-w' plain type='primary' open-type='getUserInfo' 
            onGetUserInfo={this.onGetUserInfo} 
          >微信登录</Button>
        </AtActionSheetItem>
      </AtActionSheet>
    );
  }
}
