import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text, Block, Label } from "@tarojs/components";
import { AtForm, AtRadio, AtButton, AtTextarea } from "taro-ui";
import moment from 'moment';

import API from '../../services/api';
import user from '../../services/user';
import { getGlobalData } from '../../services/global_data';

import "./index.scss";

export default class PrintBookProperty extends Component {
  constructor() {
    super(...arguments);
    this.onPreview = this.onPreview.bind(this);
  }

  state = {
  };

  componentWillMount () {
    this.setState(getGlobalData('book'));
  }

  componentDidMount() {
  }

  onPreview() {
    let { cover } = this.state.book.book;
    Taro.previewImage({
      current: cover,
      urls: [cover]
    });
  }

  onSubmit() {
    API.put(`/print_books/${this.state.id}`, { 'description': this.state.description, 
      'property': this.state.property }).then(res => {
      // console.log(res)
      Taro.navigateBack({ delta: 1 });
    }).catch(err => {
      console.error(err);
    });
  }

  onReset() {
    this.setState(getGlobalData('book'));
  }

  onSelectBookProperty(value) {
    this.setState({
      property: value
    })
  }

  onEditBookDescription(e) {
    this.setState({
      description: e.target.value
    })
  }

  handleChange() {

  }

  config = {
    navigationBarTitleText: "藏书信息修改"
  };

  render() {
    const { book, status } = this.state;

    return (
      <View>
        {book && (
          <Block>
            <View className='at-row at-row__align--start book'>
              <View className='at-col book__info'>
                <View className='book__info-title'>{book.title}</View>
                <View>作者：{book.author_name}</View>
                <View>出版社：{book.publisher_name}</View>
                <View>出版日期：{moment(book.pubdate).format('YYYY-MM-DD')}</View>
                <View>ISBN：{book.isbn}</View>
                <View>状态：{status}</View>
              </View>
              <Image
                className='at-col at-col--auto book__img'
                src={book.cover}
                mode='widthFix'
                onClick={this.onPreview}
              />
            </View>

            {/* <AtForm
              onSubmit={this.onSubmit.bind(this)}
              onReset={this.onReset.bind(this)}
            > */}
              
              <View className='doc-body'>
                <View className='panel'>
                  <View className='panel__title'>藏书备注</View>
                  <View className='panel__content'>
                    <View className='text-item'>
                      <AtTextarea
                        value={this.state.description}
                        onChange={this.onEditBookDescription.bind(this)}
                        maxLength={200}
                        placeholder='添加藏书备注...'
                      />
                    </View>
                  </View>
                </View>

                <View className='panel'>
                  <View className='panel__title'>藏书属性</View>
                  <View className='panel__content no-padding'>
                    <AtRadio
                      options={[
                        { label: '共享图书', value: 'shared' },
                        { label: '可供借阅', value: 'borrowable' },
                        { label: '私有藏书', value: 'personal' }
                      ]}
                      value={this.state.property}
                      onClick={this.onSelectBookProperty.bind(this)}
                    />
                  </View>
                </View>

                {/* <View className='panel'>
                  <View className='panel__title'>取书地址</View>
                  <View className='panel__content'>
                    <View className='text-item'>
                      <AtTextarea
                        value={this.state.location}
                        onChange={this.handleChange.bind(this)}
                        maxLength={50}
                        placeholder='添加取书地址...'
                      />
                    </View>
                  </View>
                </View> */}

                {/* <AtButton formType='submit'>提交</AtButton>
                <AtButton formType='reset'>重置</AtButton> */}

                <AtButton type='primary' onClick={this.onSubmit.bind(this)} >提交</AtButton>
                <AtButton type='secondary' onClick={this.onReset.bind(this)} >重置</AtButton>
              </View>
          
            {/* </AtForm> */}
          </Block>
        )}
      </View>
    );
  }
}
