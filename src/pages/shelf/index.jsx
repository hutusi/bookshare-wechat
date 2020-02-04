import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtButton, AtMessage, AtModal, AtModalHeader, 
  AtModalContent, AtModalAction, AtInput } from 'taro-ui'

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
    isUserAuthOpened: true,
    isbnInputOpened: false,
    isbnInput: ''
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

  notFoundBook() {
    Taro.atMessage({
      'message': '未获取到图书信息!',
      'type': 'warning',
    })
  }

  showWarning(message) {
    Taro.atMessage({
      'message': message,
      'type': 'warning',
    })
  }

  gotoBookPage(isbn) {
    console.log(isbn);

    API.get('/books/isbn/' + isbn).then(apiRes => {
      // console.log(apiRes.data);
      let bookId = apiRes.data['id'];
      Taro.navigateTo({'url': `${URL.BOOK_DETAIL}?id=${bookId}`});
    }).catch(apiErr => {
      console.error(apiErr);
      this.notFoundBook();
    });
  }

  onAddBook = (e) => {
    e.stopPropagation();

    Taro.scanCode({scanType: ['barCode']}).then(res => {
      // console.log(res.result);
      this.gotoBookPage(res.result);
    }).catch(err => {
      console.log(err);
      this.setState({isbnInputOpened: true});
    });
  }

  handleIsbnInputChanged(value) {
    this.setState({isbnInput: value});
  }

  onIsbnCancel() {
    this.setState({isbnInputOpened: false});
  }

  onIsbnConfirm() {
    let isbn = this.state.isbnInput;
    if (!this.isValidIsbn(isbn)) {
      this.showWarning("输入ISBN号不正确！");
      return;
    }
    this.gotoBookPage(isbn);
    this.setState({isbnInputOpened: false});
  }

  isValidIsbn(str) {
    var sum,
        weight,
        digit,
        check,
        i;

    str = str.replace(/[^0-9X]/gi, '');

    if (str.length != 10 && str.length != 13) {
        return false;
    }

    if (str.length == 13) {
        sum = 0;
        for (i = 0; i < 12; i++) {
            digit = parseInt(str[i]);
            if (i % 2 == 1) {
                sum += 3*digit;
            } else {
                sum += digit;
            }
        }
        check = (10 - (sum % 10)) % 10;
        return (check == str[str.length-1]);
    }

    if (str.length == 10) {
        weight = 10;
        sum = 0;
        for (i = 0; i < 9; i++) {
            digit = parseInt(str[i]);
            sum += weight*digit;
            weight--;
        }
        check = 11 - (sum % 11);
        if (check == 10) {
            check = 'X';
        }
        return (check == str[str.length-1].toUpperCase());
    }
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

        <AtModal isOpened={this.state.isbnInputOpened}>
          <AtModalHeader>输入图书ISBN条码号</AtModalHeader>
          <AtModalContent>
            <AtInput
              name='isbnInput'
              title='ISBN'
              type='digit'
              maxLength='13'
              placeholder='仅输入条形码数字'
              value={this.state.isbnInput}
              onChange={this.handleIsbnInputChanged.bind(this)}
            />
          </AtModalContent>
          <AtModalAction> 
            <Button onClick={this.onIsbnCancel.bind(this)}>取消</Button> 
            <Button onClick={this.onIsbnConfirm.bind(this)}>确定</Button> 
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
