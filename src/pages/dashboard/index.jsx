import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class Dashboard extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='dashboard'>
        <Text>Hello world!</Text>
      </View>
    )
  }
}
