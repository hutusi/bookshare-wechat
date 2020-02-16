import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'

import API from '../../services/api';
import PrintBookCard from "../../components/printbook-card";
import PrintBookPagination from "../../components/printbook-pagination";

import "./index.scss";

export default class Explore extends Component {

  constructor() {
    super(...arguments);
    this.state = { 
      currentTab: 0,
      sharedBooks: [],
      sharedMeta: {},
      borrowableBooks: [],
      borrowableMeta: {},
    };

    this.fetchPrintBooks = this.fetchPrintBooks.bind(this);
    this.fetchSharedBooks = this.fetchSharedBooks.bind(this);
    this.fetchBorrowableBooks = this.fetchBorrowableBooks.bind(this);

    this.fetchFuncArray = [this.fetchSharedBooks, this.fetchBorrowableBooks];
  }

  componentWillMount () {
    this.fetchSharedBooks(1);
    this.fetchBorrowableBooks(1);
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '发现'
  }

  fetchSharedBooks(page) {
    return this.fetchPrintBooks('share', page, 'sharedBooks', 'sharedMeta');
  }

  fetchBorrowableBooks(page) {
    return this.fetchPrintBooks('borrow', page, 'borrowableBooks', 'borrowableMeta');
  }

  fetchPrintBooks(type, page, bookState, metaState) {
    let that = this;
    let fetchURL = '';
    if (type == 'share') {
      fetchURL = '/print_books/for_share';
    } else {
      fetchURL = '/print_books/for_borrow';
    }
    const promise = new Promise(function(resolve, reject) {
      API.get(fetchURL, { 'page': page }).then(res => {
        // console.log(res.data)
        that.setState({
          [bookState]: res.data['print_books'],
          [metaState]: res.data['meta'],
        });
        resolve(res.data);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
    return promise;
  }

  onPageChange(data) {
    console.log(data);
    this.fetchFuncArray[this.state.currentTab](data.current);
  }

  onPullDownRefresh() {
    // console.log(this.state.currentTab);

    this.fetchFuncArray[this.state.currentTab](1).then(result => {
      Taro.stopPullDownRefresh();
    }).catch(error => {
      console.error(error);
    });
  }

  handleClick (value) {
    this.setState({
      currentTab: value
    })
  }

  render () {
    const tabList = [{ title: '共享' }, { title: '借阅' }];

    return (
      <View className='explore'>
        <AtTabs className='at-tabs' current={this.state.currentTab} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.currentTab} index={0} >
            <PrintBookPagination 
              printBooks={this.state.sharedBooks}
              totalPages={this.state.sharedMeta['total_pages']}
              perPage={this.state.sharedMeta['per_page']}
              currentPage={this.state.sharedMeta['current_page']}
              onPageChange={this.onPageChange.bind(this)}
            />
          </AtTabsPane>
          <AtTabsPane current={this.state.currentTab} index={1}>
            <PrintBookPagination 
              printBooks={this.state.borrowableBooks}
              totalPages={this.state.borrowableMeta['total_pages']}
              perPage={this.state.borrowableMeta['per_page']}
              currentPage={this.state.borrowableMeta['current_page']}
              onPageChange={this.onPageChange.bind(this)}
            />
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
