import Taro from "@tarojs/taro";
import BASE_URL from "./config";
import user from './user';

export default {
  baseOptions(params, method = "GET") {
    const userId = user.userId;
    const apiToken = user.apiToken;

    let { url, data } = params;
    let contentType = "application/json";
    contentType = params.contentType || contentType;
    let urlStr = BASE_URL + url;
    urlStr +='?user_id=' + userId + '&api_token=' + apiToken;
    console.log(urlStr);
    const option = {
      url: urlStr,
      data: data,
      method: method,
      header: {
        "content-type": contentType
        // Authorization: Taro.getStorageSync("Authorization")
      }
    };
    return Taro.request(option);
  },
  get(url, data = "") {
    let params = { url, data };
    return this.baseOptions(params, "GET");
  },
  post: function(url, data, contentType) {
    let params = { url, data, contentType };
    return this.baseOptions(params, "POST");
  },
  put(url, data = "") {
    let params = { url, data };
    return this.baseOptions(params, "PUT");
  },
  delete(url, data = "") {
    let params = { url, data };
    return this.baseOptions(params, "DELETE");
  }
};
