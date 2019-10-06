import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import API from '../../services/api';
import Panel from '../../components/panel';
import HorizonList from '../../components/horizon-list';
import URL from "../../constants/urls";

export default class Shelf extends Component {

  state = {
    books: []
  }

  componentWillMount () {
    API.get('/books')
       .then(res =>
            this.setState({books: res.data})
            )
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
          url={`${URL.BOOK_LIST}?type=new`}
          title='新书速递'
          className='panel--first'
        >
          <HorizonList data={this.state.books} />
        </Panel>
      </View>
    )
  }
}
