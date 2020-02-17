import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtMessage, AtNoticebar } from "taro-ui";

import API from '../../services/api';
import PrintBookCard from "../../components/printbook-card";
import PrintBookPagination from "../../components/printbook-pagination";

import "./index.scss";

export default class PrintBookList extends Component {

  constructor() {
    super(...arguments);
    this.state = { 
      printBooks: [],
      meta: {},
    };
    this.onFetchBooks = this.onFetchBooks.bind(this);
  }

  componentDidMount() {
    const { type } = this.$router.params;
    let title = '';
    switch (type) {
      case "sharedBooks": {
        title = '我的共享藏书';
        this.fetchURL = '/shelfs/shared';
        break
      }
      case "lentBooks": {
        title = '我的借出';
        this.fetchURL = '/shelfs/lent';
        break
      }
      case "borrowedBooks": {
        title = '我的借入';
        this.fetchURL = '/shelfs/borrowed';
        break
      }
      case "receivedBooks": {
        title = '我借入的共享藏书';
        this.fetchURL = '/shelfs/received';
        break
      }
      case "personalBooks": {
        title = '我的藏书';
        this.fetchURL = '/shelfs/personal';
        break
      }
    }

    Taro.setNavigationBarTitle({ title: title });
    this.onFetchBooks(1);
  }

  onFetchBooks(page) {
    API.get(this.fetchURL, { 'page': page }).then(res => {
      // console.log(res.data)
      this.setState({
        printBooks: res.data['print_books'],
        meta: res.data['meta'],
      });
    }).catch(err => {
      console.error(err);
    });
  }

  onPageChange(data) {
    console.log(data);
    this.onFetchBooks(data.current);
  }

  config = {
    navigationBarTitleText: ""
  };

  render() {
    return (
      <View>
        <AtMessage />

        <PrintBookPagination 
          printBooks={this.state.printBooks}
          totalCount={this.state.meta['total_count']}
          perPage={this.state.meta['per_page']}
          currentPage={this.state.meta['current_page']}
          onPageChange={this.onPageChange.bind(this)}
        />
      </View>
    );
  }
}
