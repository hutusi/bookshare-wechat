import Taro, { Component } from "@tarojs/taro";
import { View, Navigator, Image, Text } from "@tarojs/components";
import { AtAvatar } from 'taro-ui';

import "./index.scss";
import user from "../../services/user";

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
      loggedIn: user.isLoggedIn()
    };
  }

  componentWillMount () {
    // user.fetchInfo().then(userInfo => {
    //   console.log('fetchInfo--->:');
    //   console.log(userInfo);
    //   this.setState({
    //     userInfo: userInfo,
    //     loggedIn: user.isLoggedIn()
    //   });
    // }); 
  }

  onLogging() {
    user.login();

    this.setState({
      userInfo: user.getInfo(),
      loggedIn: user.isLoggedIn()
    });
  }

  render() {
    const { userInfo, loggedIn } = this.state;
    return (
      <View>
        {loggedIn ? (
          <View
            className='at-row at-row__align--start user-profile'
            hoverClass='None'
            onClick={this.onLogging}
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
      </View>
    );
  }
}
