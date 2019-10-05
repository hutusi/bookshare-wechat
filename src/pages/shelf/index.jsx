import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class Shelf extends Component {

  config = {
    navigationBarTitleText: '书架'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='shelf'>
        <Text>Hello world!</Text>
      </View>
    )
  }
}
