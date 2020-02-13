import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtMessage, AtAccordion, AtList, AtListItem  } from 'taro-ui'

import URL from "../../constants/urls";
import API from '../../services/api';
import user from '../../services/user';
import UserProfile from '../../components/user-profile';

import bookPng from '../../assets/icons/book.png'

import "./index.scss";

export default class Dashboard extends Component {

  constructor() {
    super(...arguments);
    
    this.state = {
      todoAccordionOpened: true,
      todo: [],
      applyAccordionOpened: true,
      apply: []
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

  onClickAccordion (stateName, value) {
    this.setState({
      [stateName]: value
    });
  }

  onFetchDashboard() {
    let that = this;
    const promise = new Promise(function(resolve, reject) {
      API.get('/dashboard').then(apiRes => {
        console.log(apiRes.data);
        that.setState({
          todo: apiRes.data['todo'],
          apply: apiRes.data['apply'],
        });
        resolve(apiRes.data);
      }).catch(apiErr => {
        console.error(apiErr);
        reject(apiErr);
      });
    });
    return promise;
  }

  onPullDownRefresh() {
    this.onFetchDashboard().then(result => { 
      Taro.stopPullDownRefresh();
    }).catch(error => {
      console.error(error);
    });
  }

  onClickTodoItem(sharingId) {
    Taro.navigateTo({'url': `${URL.SHARING_DETAIL}?id=${sharingId}`});
  }

  config = {
    navigationBarTitleText: '我的'
  }

  render () {
    const { todo, todoAccordionOpened, apply, applyAccordionOpened } = this.state

    return (
      <View className='dashboard'>

        <AtMessage />

        <UserProfile />

        <AtAccordion
          open={todoAccordionOpened}
          title='待办事项'
          onClick={this.onClickAccordion.bind(this, 'todoAccordionOpened')}
        >
          <AtList hasBorder={false}>
            {todo.map(item => {
              return (
                <AtListItem
                  key={item.id}
                  title={item.title}
                  note={item.note}
                  thumb={bookPng}
                  onClick={this.onClickTodoItem.bind(this, item.id)}
                />
              );
            })}
          </AtList>
        </AtAccordion>

        <AtAccordion
          open={applyAccordionOpened}
          title='我的申请'
          onClick={this.onClickAccordion.bind(this, 'applyAccordionOpened')}
        >
          <AtList hasBorder={false}>
            {apply.map(item => {
              return (
                <AtListItem
                  key={item.id}
                  title={item.title}
                  note={item.note}
                  thumb={bookPng}
                  onClick={this.onClickTodoItem.bind(this, item.id)}
                />
              );
            })}
          </AtList>
        </AtAccordion>

      </View>
    )
  }
}
