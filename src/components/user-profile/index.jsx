import Taro, { Component } from "@tarojs/taro";
import { View, Navigator, Image, Text } from "@tarojs/components";
import { AtAvatar } from 'taro-ui';

import "./index.scss";
import user from "../../services/user";
import AuthActionSheet from '../../components/auth-action-sheet';

export default class UserProfile extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    userInfo: {},
    loggedIn: false,
    showArrow: true
  };

  constructor(props) {
    super(props);

    this.state = {
      userInfo: user.getInfo(),
      loggedIn: user.isLoggedIn(),
      isAuthNeeded: false
    };
  }

  componentWillMount() {
    this.tryLogin();
  }

  // setLoginInfo() {
  //   this.setState({
  //     userInfo: user.getInfo(),
  //     loggedIn: user.isLoggedIn()
  //   });
  // }

  tryLogin() {
    let that = this;
    user.login().then(result => {
      // console.log(result)
      that.setState({
        userInfo: user.getInfo(),
        loggedIn: user.isLoggedIn(),
        isAuthNeeded: false
      });
    }).catch(error => {
      console.error(error);

      that.setState({
        userInfo: user.getInfo(),
        loggedIn: false,
        isAuthNeeded: true
      });
    });
  }

  onLogging() {
    this.tryLogin();
  }

  GetUserInfo(e) {
    this.tryLogin();
  }

  render() {
    const { userInfo, loggedIn, isAuthNeeded } = this.state;
    return (
      <View>
        {loggedIn ? (
          <View
            className='at-row at-row__align--start user-profile'
            hoverClass='None'
          >
            <View className='at-col user-profile__avatar'>
              <AtAvatar circle size='normal' image={userInfo['avatar']}></AtAvatar>
            </View>
            <View className='at-col user-profile__info'>
              <View className='user-profile__info-name'>{userInfo['nickname']}</View>
            </View>
          </View>
        ) : (
          <View
            className='at-row at-row__align--start user-profile'
            hoverClass='None'
            onClick={this.onLogging}
          >
            <View className='at-col user-profile__avatar'>
              <AtAvatar circle size='normal' text='书'></AtAvatar>
            </View>
            <View className='at-col user-profile__info'>
              <View className='user-profile__info-name'>未登陆</View>
            </View>
          </View>
        )}
        {/* {showArrow && (
          <Text
            className='at-icon at-icon-chevron-right panel-header__arrow at-col at-col-1 at-col--auto'
            style={{ alignSelf: "center" }}
          />
        )} */}

        <AuthActionSheet isAuthNeeded={isAuthNeeded} onGetUserInfo={this.GetUserInfo.bind(this)} />
      </View>
    );
  }
}
