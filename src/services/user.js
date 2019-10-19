import Taro from '@tarojs/taro'
import API from './api'

let instance = null;

class User {
  constructor() {
    this.userId = Taro.getStorageSync('user_id');
    this.apiToken = Taro.getStorageSync('api_token');
  }

  static getUser() {
    if (!instance) {
      instance = new User();
    }
    return instance;
  }

  login() {
    if (!(this.userId && this.apiToken)) {
      (async() => {
        try {
            const result = await Taro.login();
            const response = API.post('/sessions/wechat', {js_code: result.code});
            
            this.userId = response.data['user_id'];
            this.apiToken = response.data['api_token'];
            Taro.setStorageSync('user_id', this.userId);
            Taro.setStorageSync('api_token', this.apiToken);

            const userRes = await Taro.getUserInfo();
            this.userInfo = userRes.userInfo
            const putRes = API.put('/users/' + this.userId, 
              {nickname: this.userInfo.nickName,
              avatar: this.userInfo.avatarUrl, gender: this.userInfo.gender, 
              country: this.userInfo.country, province: this.userInfo.province,
              city: this.userInfo.city, language: this.userInfo.language});

            console.log(putRes);
        } catch (err) {
            console.log("login failed: " + err);
        }
      })();
    }
  }

  isLogin() {
    const user_id = Taro.getStorageSync('user_id');
    const api_token = Taro.getStorageSync('api_token');

    return (user_id && api_token);
  }

  getInfo() {
    return this.userInfo;
  }
}

export default User.getUser();
