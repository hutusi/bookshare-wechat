import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import API from '../../services/api';
import Panel from '../../components/panel';
import HorizonList from '../../components/horizon-list';
import URL from "../../constants/urls";

export default class Shelf extends Component {

  state = {
    sharedBooks: [],
    lentBooks: [],
    borrowedBooks: [],
    receivedBooks: [],
    personalBooks: []
  }

  componentWillMount () {
    API.get('/shelfs/summary?provider=wechat&uid=1', "{'provider':'wechat','uid':'1'}")
       .then(res => {
          console.log(res.data)
          this.setState({sharedBooks: res.data['shared']})
          this.setState({lentBooks: res.data['lent']})
          this.setState({borrowedBooks: res.data['borrowed']})
          this.setState({receivedBooks: res.data['received']})
          this.setState({personalBooks: res.data['personal']})
       })
  }

  componentDidMount () { 
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '书架'
  }

  render () {
    return (
      <View className='shelf'>

        <Panel
          url={`${URL.BOOK_LIST}?type=sharedBooks`}
          title='我的分享'
          className='panel--first'
        >
          <HorizonList data={this.state.sharedBooks} />
        </Panel>

        <Panel
          url={`${URL.BOOK_LIST}?type=lentBooks`}
          title='我的借出'
          className='panel--first'
        >
          <HorizonList data={this.state.lentBooks} />
        </Panel>

        <Panel
          url={`${URL.BOOK_LIST}?type=borrowedBooks`}
          title='我的借入'
          className='panel--first'
        >
          <HorizonList data={this.state.borrowedBooks} />
        </Panel>

        <Panel
          url={`${URL.BOOK_LIST}?type=personalBooks`}
          title='我的藏书'
          className='panel--first'
        >
          <HorizonList data={this.state.personalBooks} />
        </Panel>

      </View>
    )
  }
}
