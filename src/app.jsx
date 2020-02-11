import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/shelf/index',
      'pages/explore/index',
      'pages/dashboard/index',

      'pages/printbook-list/index',
      'pages/printbook-detail/index',

      'pages/book-detail/index',
      'pages/printbook-property/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: true,
      backgroundTextStyle: 'dark'
    },
    tabBar: {
      list: [
        {
          pagePath: "pages/explore/index",
          text: "发现",
          iconPath: "./assets/icons/tab_library.png",
          selectedIconPath: "./assets/icons/tab_library_s.png"
        },
        {
          pagePath: "pages/shelf/index",
          text: "书架",
          iconPath: "./assets/icons/tab_shelf.png",
          selectedIconPath: "./assets/icons/tab_shelf_s.png"
        },
        {
          pagePath: "pages/dashboard/index",
          text: "我的",
          iconPath: "./assets/icons/tab_user.png",
          selectedIconPath: "./assets/icons/tab_user_s.png"
        },
      ],
      color: "#a6a6a6",
      selectedColor: "#78a4fa",
      backgroundColor: "#ffffff",
      borderStyle: "black"
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
