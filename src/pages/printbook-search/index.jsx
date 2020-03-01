import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtMessage, AtButton } from "taro-ui";

import API from '../../services/api';
import PrintBookPagination from "../../components/printbook-pagination";

import "./index.scss";

export default class PrintBookSearch extends Component {

  constructor() {
    super(...arguments);
    this.state = { 
      printBooks: [],
      meta: {},
    };
    this.onFetchBooks = this.onFetchBooks.bind(this);
  }

  componentDidMount() {
    const { property, keyword } = this.$router.params;
    Taro.setNavigationBarTitle({ title: '藏书搜索' });

    this.fetchURL = '/print_books/search';
    this.fetchParams = {'property': property, 'keyword': keyword}
    this.onFetchBooks(1);
  }

  onFetchBooks(page) {
    let params = this.fetchParams;
    params['page'] = page;
    API.get(this.fetchURL, params).then(res => {
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
