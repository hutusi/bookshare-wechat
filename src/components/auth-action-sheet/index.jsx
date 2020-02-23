import Taro, { Component } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { AtActionSheet, AtActionSheetItem } from 'taro-ui';

import "./index.scss";
import user from "../../services/user";

export default class AuthActionSheet extends Component {
  static options = {
    addGlobalClass: true
  };

  constructor(props) {
    super(props);

    this.onGetUserInfo = this.onGetUserInfo.bind(this);
    this.login = this.login.bind(this);
  }

  state = {
    isAuthNeeded: false
  };

  componentWillMount() {
    if (user.isLoggedIn()) {
      user.fetchInfo();
      this.setState({isAuthNeeded: false});
    } else {
      this.setState({isAuthNeeded: true});
    }
  }

  onGetUserInfo(e) {
    e.stopPropagation()

    // console.log('GetUserInfo ....', e);
    // console.log(this.props);

    this.login();
  }

  login() {
    user.login().then(result => {
      // console.log(user.getInfo());
      this.setState({isAuthNeeded: false});
      if (this.props.onLoginSuccess) {
        this.props.onLoginSuccess({ result: result, userInfo: user.getInfo() });
      }
    }).catch(error => {
      console.error(error);
      this.setState({isAuthNeeded: true});
      if (this.props.onLoginFailed) {
        this.props.onLoginFailed({ error: error });
      }
    });
  }

  render() {
    const { isAuthNeeded } = this.state;
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
