import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtMessage, AtNoticebar } from "taro-ui";

import API from '../../services/api';
import PrintBookCard from "../../components/printbook-card";

import "./index.scss";

export default class PrintBookList extends Component {

  constructor() {
    super(...arguments);
    this.state = { print_books: [] };
  }

  componentDidMount() {
    const { type } = this.$router.params;
    switch (type) {
      case "sharedBooks": {
        Taro.setNavigationBarTitle({ title: "我的分享" })
        API.get('/shelfs/shared')
           .then(res => {
              // console.log(res.data)
              this.setState({print_books: res.data['print_books']})
        })
        break
      }
      case "lentBooks": {
        Taro.setNavigationBarTitle({ title: "我的借出" })
        API.get('/shelfs/lent')
           .then(res => {
              // console.log(res.data)
              this.setState({print_books: res.data['print_books']})
        })
        break
      }
      case "borrowedBooks": {
        Taro.setNavigationBarTitle({ title: "我的借入" })
        API.get('/shelfs/borrowed')
           .then(res => {
              // console.log(res.data)
              this.setState({print_books: res.data['print_books']})
        })
        break
      }
      case "personalBooks": {
        Taro.setNavigationBarTitle({ title: "我的藏书" })
        API.get('/shelfs/personal')
           .then(res => {
              // console.log(res.data)
              this.setState({print_books: res.data['print_books']})
        })
        break
      }
    }
  }

  config = {
    navigationBarTitleText: ""
  };

  render() {
    let data = this.state.print_books;
    return (
      <View>
        <AtMessage />
        {data.map(item => (
          <PrintBookCard data={item} key={item.id} />
        ))}
      </View>
    );
  }
}
