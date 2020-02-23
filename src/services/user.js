import Taro from '@tarojs/taro'
import API from './api'

let instance = null;

class User {
  constructor() {
    // Taro.removeStorageSync('user_id');
    // Taro.removeStorageSync('api_token');
    this.userId = Taro.getStorageSync('user_id');
    this.apiToken = Taro.getStorageSync('api_token');
    this.userInfo = {'nickname': 'John Doe'};
  }

  static getUser() {
    if (!instance) {
      instance = new User();
    }
    return instance;
  }

  login() {
    let that = this;
    const promise = new Promise(function(resolve, reject) {
      if (!(that.userId && that.apiToken)) {
        Taro.login().then(result => {
          // console.log(result)
          API.post('/sessions/wechat', {js_code: result.code}).then(response => {
            that.saveStrorage(response.data['user_id'], response.data['api_token']);
            that.updateUserInfo().then(infoRes => {
              resolve(infoRes);
            }).catch(infoError => {
              reject(infoError);
            });
          }).catch(api_err => {
            console.error(api_err);
            reject(api_err);
          });
        }).catch(err => {
          console.error(err);
          reject(err);
        });
      } else {
        that.fetchInfo().then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      }

    });

    return promise;
  }

  saveStrorage(user_id, api_token) {
    this.userId = user_id;
    this.apiToken = api_token;
    Taro.setStorageSync('user_id', this.userId);
    Taro.setStorageSync('api_token', this.apiToken);
  }

  updateUserInfo() {
    let that = this;
    const promise = new Promise(function(resolve, reject) {
      Taro.getUserInfo().then(result => {
        // console.log(result.userInfo);
        API.put('/users/' + that.userId, { nickname: result.userInfo.nickName,
          avatar: result.userInfo.avatarUrl, gender: result.userInfo.gender, 
          country: result.userInfo.country, province: result.userInfo.province,
          city: result.userInfo.city, language: result.userInfo.language}).then(apiRes => {
            that.userInfo = apiRes.data['user'];
            resolve(that.userInfo);
        }).catch(apiErr => {
          console.error(apiErr);
          reject(apiErr);
        });
      }).catch(err => {
        console.error(err);
        reject(err);
      });
    });
    return promise;
  }

  fetchInfo() {
    let that = this;
    const promise = new Promise(function(resolve, reject) {
      API.get('/users/' + that.userId
        ).then(result => {
          // console.log(result.data);
          that.userInfo = result.data['user'];
          resolve(that.userInfo);
        }).catch(err => {
          console.error(err);
          reject(err);
        });
    });
    return promise;
  }

  isLoggedIn() {
    return (this.userId && this.apiToken);
  }

  getInfo() {
    return this.userInfo;
  }
}

export default User.getUser();
