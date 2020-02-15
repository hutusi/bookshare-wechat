import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'

import API from '../../services/api';
import PrintBookCard from "../../components/printbook-card";

import "./index.scss";

export default class Explore extends Component {

  constructor() {
    super(...arguments);
    this.state = { 
      currentTab: 0,
      shared_books: [], 
      borrowable_books: []
    };
  }

  componentWillMount () {
    this.fetchSharedBooks();
    this.fetchBorrowableBooks();
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '发现'
  }

  fetchSharedBooks() {
    let that = this;
    const promise = new Promise(function(resolve, reject) {
      API.get('/print_books/for_share').then(res => {
        console.log(res)
        that.setState({shared_books: res.data['print_books']});
        resolve(res.data);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
    return promise;
  }

  fetchBorrowableBooks() {
    let that = this;
    const promise = new Promise(function(resolve, reject) {
      API.get('/print_books/for_borrow').then(res => {
        // console.log(res.data)
        that.setState({borrowable_books: res.data['print_books']});
        resolve(res.data);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
    return promise;
  }

  onPullDownRefresh() {
    // console.log(this.state.currentTab);
    var fetchFunc;

    if (this.state.currentTab == 0) {
      fetchFunc = this.fetchSharedBooks.bind(this);
    } else {
      fetchFunc = this.fetchBorrowableBooks.bind(this);
    }

    fetchFunc().then(result => { 
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
    const tabList = [{ title: '共享' }, { title: '借阅' }]
    let shared_books = this.state.shared_books;
    let borrowable_books = this.state.borrowable_books;

    return (
      <View className='explore'>
        <AtTabs className='at-tabs' current={this.state.currentTab} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.currentTab} index={0} >
            {shared_books.map(item => (
              <PrintBookCard data={item} key={item.id} />
            ))}
          </AtTabsPane>
          <AtTabsPane current={this.state.currentTab} index={1}>
            {borrowable_books.map(item => (
              <PrintBookCard data={item} key={item.id} />
            ))}
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
