import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtButton, AtMessage } from 'taro-ui'

import API from '../../services/api';
import REST from '../../services/rest';
import user from '../../services/user';
import Panel from '../../components/panel';
import HorizonList from '../../components/horizon-list';
import URL from "../../constants/urls";
import UserProfile from '../../components/user-profile';

import './index.scss'

export default class Shelf extends Component {

  state = {
    sharedBooks: [],
    lentBooks: [],
    borrowedBooks: [],
    receivedBooks: [],
    personalBooks: [],
    isUserAuthOpened: true
  }

  componentWillMount () {
    this.refresh();
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '书架'
  }

  refresh() {
    let that = this;
    const promise = new Promise(function(resolve, reject) {
      API.get('/shelfs/summary').then(res => {
        // console.log(res.data)
        that.setState({sharedBooks: res.data['shared']})
        that.setState({lentBooks: res.data['lent']})
        that.setState({borrowedBooks: res.data['borrowed']})
        that.setState({receivedBooks: res.data['received']})
        that.setState({personalBooks: res.data['personal']})

        resolve(res.data);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
    return promise;
  }

  notFoundBook () {
    Taro.atMessage({
      'message': '未获取到图书信息!',
      'type': 'warning',
    })
  }

  onAddBook = (e) => {
    e.stopPropagation();

    Taro.scanCode({scanType: ['barCode']})
      .then(res => {
        console.log(res.result);
        API.get('/books/isbn/' + res.result)
          .then(api_res => {
            console.log(api_res.data);
            // if(api_res.statusCode == 404) {
            //   const douban_url = 'https://douban.uieee.com/v2/book/isbn/' + res.result;
            //   REST.get(douban_url)
            //     .then(douban_res => {
            //       console.log(douban_res);
            //     });
            // }
            let book_id = api_res.data['id'];
            Taro.navigateTo({'url': `${URL.BOOK_DETAIL}?id=${book_id}`});
          })
          .catch(api_err => {
            console.error(api_err);
            this.notFoundBook();
          });

        // (async() => {
        //   try {
        //       console.log(res.result);
        //       const api_res = await API.get('/books/isbn/' + res.result);
        //       console.log(api_res);
        //       if(api_res.status == 404) {
        //         // const douban_url = 'https://douban.uieee.com/v2/book/isbn/' + res.result;
        //         // const douban_res = await REST.get(douban_url);
        //         // console.log(douban_res);
        //       }
    
        //   } catch (err) {
        //       console.log("login failed: " + err);
        //   }
        // })();
      })
      .catch(err => console.log(err));
  }

  onPullDownRefresh() {
    this.refresh().then(result => { 
      Taro.stopPullDownRefresh();
    }).catch(error => {
      console.error(error);
    });
  }

  render () {
    return (
      <View className='shelf'>

        <AtMessage />

        <UserProfile />

        {this.state.sharedBooks.length > 0 &&
          <Panel
            url={`${URL.PRINT_BOOK_LIST}?type=sharedBooks`}
            title='我的分享'
            className='panel--first'
          >
            <HorizonList data={this.state.sharedBooks} />
          </Panel>
        }

        {this.state.lentBooks.length > 0 &&
          <Panel
            url={`${URL.PRINT_BOOK_LIST}?type=lentBooks`}
            title='我的借出'
            className='panel--first'
          >
            <HorizonList data={this.state.lentBooks} />
          </Panel>
        }

        {this.state.borrowedBooks.length > 0 &&
          <Panel
            url={`${URL.PRINT_BOOK_LIST}?type=borrowedBooks`}
            title='我的借入'
            className='panel--first'
          >
            <HorizonList data={this.state.borrowedBooks} />
          </Panel>
        }

        {this.state.personalBooks.length > 0 &&
          <Panel
            url={`${URL.PRINT_BOOK_LIST}?type=personalBooks`}
            title='我的藏书'
            className='panel--first'
          >
            <HorizonList data={this.state.personalBooks} />
          </Panel>
        }

        <AtButton type='primary' onClick={this.onAddBook}>添加藏书</AtButton>
      </View>
    )
  }
}
