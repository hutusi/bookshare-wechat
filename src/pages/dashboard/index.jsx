import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtMessage, AtAccordion, AtList, AtListItem  } from 'taro-ui'

import URL from "../../constants/urls";
import API from '../../services/api';
import user from '../../services/user';
import UserProfile from '../../components/user-profile';
import AccordionList from '../../components/accordion-list';

import bookPng from '../../assets/icons/book.png'

import "./index.scss";

export default class Dashboard extends Component {

  constructor() {
    super(...arguments);
    
    this.state = {
      approvingSharings: [],
      requestingSharings: [],
      approvingBorrowings: [],
      requestingBorrowings: []
    }

    this.onFetchDashboard = this.onFetchDashboard.bind(this);
  }

  componentWillMount () {
    this.onFetchDashboard();
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onFetchDashboard() {
    let that = this;
    const promise = new Promise(function(resolve, reject) {
      API.get('/dashboard').then(apiRes => {
        console.log(apiRes.data);
        that.setState({
          approvingSharings: that.toApprovingItems(apiRes.data['approving_sharings']),
          requestingSharings: that.toRequestingItems(apiRes.data['requesting_sharings']),
          approvingBorrowings: that.toApprovingItems(apiRes.data['approving_borrowings']),
          requestingBorrowings: that.toRequestingItems(apiRes.data['requesting_borrowings']),
        });
        resolve(apiRes.data);
      }).catch(apiErr => {
        console.error(apiErr);
        reject(apiErr);
      });
    });
    return promise;
  }

  toApprovingItems(data) {
    let items = []
    data.forEach(element => {
      items.push({
        id: element.id,
        title: element.book.title,
        note: element.status + ' - ' + element.receiver.nickname,
        thumb: bookPng,
      });
    });
    return items;
  }

  toRequestingItems(data) {
    let items = []
    data.forEach(element => {
      items.push({
        id: element.id,
        title: element.book.title,
        note: element.status + ' - ' + element.holder.nickname,
        thumb: bookPng,
      });
    });
    return items;
  }

  onPullDownRefresh() {
    this.onFetchDashboard().then(result => { 
      Taro.stopPullDownRefresh();
    }).catch(error => {
      console.error(error);
    });
  }

  config = {
    navigationBarTitleText: '我的'
  }

  render () {
    return (
      <View className='dashboard'>

        <AtMessage />

        <UserProfile />

        <AccordionList title='待确认共享' data={this.state.approvingSharings} />
        <AccordionList title='申请共享' data={this.state.requestingSharings} />
        <AccordionList title='待确认借出' data={this.state.approvingBorrowings} />
        <AccordionList title='申请借入' data={this.state.requestingBorrowings} />

      </View>
    )
  }
}
