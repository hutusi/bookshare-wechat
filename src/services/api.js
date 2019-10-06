import Taro from "@tarojs/taro";
import BASE_URL from "./config";

export default {
  baseOptions(params, method = "GET") {
    let { url, data } = params;
    let contentType = "application/json";
    contentType = params.contentType || contentType;
    const option = {
      url: url.indexOf("http") !== -1 ? url : BASE_URL + url,
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
