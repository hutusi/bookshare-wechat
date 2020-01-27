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
        that.userInfo = result.userInfo;
        API.put('/users/' + that.userId, { nickname: that.userInfo.nickName,
          avatar: that.userInfo.avatarUrl, gender: that.userInfo.gender, 
          country: that.userInfo.country, province: that.userInfo.province,
          city: that.userInfo.city, language: that.userInfo.language}).then(res => {
            resolve(that.userInfo);
        }).catch(api_err => {
          console.error(api_err);
          reject(api_err);
        });
      }).catch(err => {
        console.error(err);
        reject(err);
      });
    });
    return promise;
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
    let that = this;
    const promise = new Promise(function(resolve, reject) {
      API.get('/users/' + that.userId
        ).then(result => {
          that.userInfo = result.data;
          console.log(that.userInfo)
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
