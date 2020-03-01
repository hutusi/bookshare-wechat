import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtSearchBar } from 'taro-ui'

import URL from "../../constants/urls";
import user from "../../services/user";
import API from '../../services/api';
import PrintBookPagination from "../../components/printbook-pagination";
import AuthActionSheet from '../../components/auth-action-sheet';

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

      initSearchValue: '',
      sharedSearchValue: '',
      borrowableSearchValue: '',
    };

    this.fetchBooks = this.fetchBooks.bind(this);
    this.fetchPrintBooks = this.fetchPrintBooks.bind(this);
    this.fetchSharedBooks = this.fetchSharedBooks.bind(this);
    this.fetchBorrowableBooks = this.fetchBorrowableBooks.bind(this);

    this.fetchFuncArray = [this.fetchSharedBooks, this.fetchBorrowableBooks];
  }

  componentWillMount () {
    this.fetchBooks();
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '发现'
  }

  onShareAppMessage (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '共享图书馆',
      path: '/pages/explore/index'
    }
  }

  fetchBooks() {
    if (user.isLoggedIn()) {
      this.fetchSharedBooks(1);
      this.fetchBorrowableBooks(1);
    }
  }

  handleLoginSuccess() {
    this.fetchBooks();
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
    // console.log(data);
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

  handleSearchBarChange(searchValue, value) {
    // console.log(value, searchValue);
    this.setState({
      [searchValue]: value
    })
  }

  handleSearchBarActionClick(property, searchValue) {
    let keyword = encodeURIComponent(this.state[searchValue].trim());
    console.log(keyword);
    Taro.navigateTo({'url': `${URL.PRINT_BOOK_SEARCH}?property=${property}&keyword=${keyword}`});
  }

  render () {
    const tabList = [{ title: '共享' }, { title: '借阅' }];

    return (
      <View className='explore'>
        <AtTabs className='at-tabs' current={this.state.currentTab} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.currentTab} index={0} >
            <AtSearchBar
              value={this.state.initSearchValue}
              onChange={this.handleSearchBarChange.bind(this, 'sharedSearchValue')}
              onActionClick={this.handleSearchBarActionClick.bind(this, 'shared', 'sharedSearchValue')}
              onConfirm={this.handleSearchBarActionClick.bind(this, 'shared', 'sharedSearchValue')}
            />
            <PrintBookPagination 
              printBooks={this.state.sharedBooks}
              totalCount={this.state.sharedMeta['total_count']}
              perPage={this.state.sharedMeta['per_page']}
              currentPage={this.state.sharedMeta['current_page']}
              onPageChange={this.onPageChange.bind(this)}
            />
          </AtTabsPane>
          <AtTabsPane current={this.state.currentTab} index={1}>
            <AtSearchBar
              value={this.state.initSearchValue}
              onChange={this.handleSearchBarChange.bind(this, 'borrowableSearchValue')}
              onActionClick={this.handleSearchBarActionClick.bind(this, 'borrowable', 'borrowableSearchValue')}
              onConfirm={this.handleSearchBarActionClick.bind(this, 'borrowable', 'borrowableSearchValue')}
            />
            <PrintBookPagination 
              printBooks={this.state.borrowableBooks}
              totalCount={this.state.borrowableMeta['total_count']}
              perPage={this.state.borrowableMeta['per_page']}
              currentPage={this.state.borrowableMeta['current_page']}
              onPageChange={this.onPageChange.bind(this)}
            />
          </AtTabsPane>
        </AtTabs>

        <AuthActionSheet onLoginSuccess={this.handleLoginSuccess.bind(this)} />
      </View>
    )
  }
}
