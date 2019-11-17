import Taro from '@tarojs/taro'
import API from './api'

let instance = null;

class User {
  constructor() {
    // Taro.removeStorageSync('user_id');
    // Taro.removeStorageSync('api_token');
    this.userId = '1'; // Taro.getStorageSync('user_id');
    this.apiToken = '1'; // Taro.getStorageSync('api_token');
    this.userInfo = {'nickname': 'John Doe'};
  }

  static getUser() {
    if (!instance) {
      instance = new User();
    }
    return instance;
  }

  // async login() {
  //   console.log("start....")
  //   if (!(this.userId && this.apiToken)) {
  //       try {
  //           const result = await Taro.login();
  //           console.log(result)
  //           const response = await API.post('/sessions/wechat', {js_code: result.code});
  //           console.log(response)
  //           this.userId = response.data['user_id'];
  //           this.apiToken = response.data['api_token'];
  //           Taro.setStorageSync('user_id', this.userId);
  //           Taro.setStorageSync('api_token', this.apiToken);

  //           const userRes = await Taro.getUserInfo();
  //           this.userInfo = userRes.userInfo;
  //           const putRes = await API.put('/users/' + this.userId, 
  //             {nickname: this.userInfo.nickName,
  //             avatar: this.userInfo.avatarUrl, gender: this.userInfo.gender, 
  //             country: this.userInfo.country, province: this.userInfo.province,
  //             city: this.userInfo.city, language: this.userInfo.language});

  //           console.log(putRes);
  //       } catch (err) {
  //           console.log("login failed: " + err);
  //       }
  //   }
  // }

  fetchInfo() {
    return API.get('/users/' + this.userId
        ).then(result => {
          this.userInfo = result.data;
        }).catch(err => console.log(err));
  }

  isLoggedIn() {
    return (this.userId && this.apiToken);
  }

  getInfo() {
    return this.userInfo;
  }
}

export default User.getUser();
