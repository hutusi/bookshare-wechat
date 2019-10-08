import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'

import API from '../../services/api';
import BookCard from "../../components/book-card";

import "./index.scss";

export default class Explore extends Component {

  constructor() {
    super(...arguments);
    this.state = { 
      current: 0,
      shared_books: [], 
      borrowable_books: []
    };
  }

  componentWillMount () { }

  componentDidMount () {
    API.get('/print_books/for_share?provider=wechat&uid=1', "{'provider':'wechat','uid':'1'}")
        .then(res => {
          // console.log(res.data)
          this.setState({shared_books: res.data['print_books']})
    })

    API.get('/print_books/for_borrow?provider=wechat&uid=1', "{'provider':'wechat','uid':'1'}")
        .then(res => {
          // console.log(res.data)
          this.setState({borrowable_books: res.data['print_books']})
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '浏览'
  }

  handleClick (value) {
    this.setState({
      current: value
    })
  }

  render () {
    const tabList = [{ title: '分享' }, { title: '借阅' }]
    let shared_books = this.state.shared_books;
    let borrowable_books = this.state.borrowable_books;

    return (
      <View className='explore'>
        <AtTabs className='at-tabs' current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} >
            {shared_books.map(item => (
              <BookCard data={item} key={item.id} />
            ))}
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            {borrowable_books.map(item => (
              <BookCard data={item} key={item.id} />
            ))}
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
