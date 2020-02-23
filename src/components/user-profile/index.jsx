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
    showArrow: true
  };

  constructor(props) {
    super(props);

    this.updateUserInfo = this.updateUserInfo.bind(this);

    this.state = {
      userInfo: {},
      loggedIn: false,
    };
  }

  componentWillMount() {
    this.updateUserInfo();
  }

  updateUserInfo() {
    this.setState({
      userInfo: user.getInfo(),
      loggedIn: user.isLoggedIn(),
    });
  }

  handleLoginSuccess() {
    this.updateUserInfo()
  }

  render() {
    const { userInfo, loggedIn } = this.state;
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

        <AuthActionSheet onLoginSuccess={this.handleLoginSuccess.bind(this)} />
      </View>
    );
  }
}
