import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtList, AtListItem  } from 'taro-ui'

import "./index.scss";

export default class Dashboard extends Component {

  config = {
    navigationBarTitleText: '我的'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='dashboard'>

        <AtList>
          <AtListItem
            title='我的藏书'
            arrow='right'
            iconInfo={{ size: 16, color: '#78A4FA', value: 'calendar', }}
          />
          <AtListItem
            title='我的借阅'
            arrow='right'
            iconInfo={{ size: 16, color: '#FF4949', value: 'bookmark', }}
          />
        </AtList>

        <Text>Hello world!</Text>
      </View>
    )
  }
}
