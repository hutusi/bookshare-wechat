import Taro, { Component } from "@tarojs/taro";
import { View, Block, Picker } from "@tarojs/components";
import { AtMessage, AtForm, AtRadio, AtButton, AtTextarea } from "taro-ui";

import BookPreviewHeader from "../../components/book-preview-header";
import API from '../../services/api';
import user from '../../services/user';
import { getGlobalData } from '../../services/global_data';

import "./index.scss";

export default class PrintBookProperty extends Component {
  constructor() {
    super(...arguments);
    this.region = null;
  }

  state = {
    isShowRegionSelector: true,
    regionValue: []
  };

  componentWillMount () {
    this.onReset();
  }

  componentDidMount() {
  }

  isPersonalProperty(property) {
    return property == 'personal';
  }

  onSubmit() {
    let params = {'description': this.state.description, 'property': this.state.property}
    // console.log(this.region);
    if (!this.isPersonalProperty(this.state.property)) {
      if (this.region) {
        params['region'] = JSON.stringify(this.region);
        params['region_code'] = this.region['district']['code'];
      } else {
        Taro.atMessage({
          'message': '共享/借阅图书请选择藏书所在区域!',
          'type': 'warning',
        });
        return;
      }      
    }
    console.log(params);
    API.put(`/print_books/${this.state.id}`, params).then(res => {
      // console.log(res)
      Taro.navigateBack({ delta: 1 });
    }).catch(err => {
      console.error(err);
    });
  }

  onReset() {
    let book = getGlobalData('book');

    this.setState(book);
    this.setState({isShowRegionSelector: !this.isPersonalProperty(book.property)});

    let userInfo = user.getInfo();
    console.log(book.region);
    console.log(userInfo.region);

    if (book.region && book.region.province) {
      this.region = book.region;
      this.setState({
        regionValue: [
          book.region.province['name'],
          book.region.city['name'],
          book.region.district['name']
        ]
      });
    } else if (userInfo.region && userInfo.region.province) {
      this.region = userInfo.region;
      this.setState({
        regionValue: [
          userInfo.region.province['name'],
          userInfo.region.city['name'],
          userInfo.region.district['name']
        ]
      });
    } else {

    }
  }

  onSelectBookProperty(value) {
    let showSelector = false;
    if (this.isPersonalProperty(value)) {
      showSelector = false;
    } else {
      showSelector = true;
    }

    this.setState({
      property: value,
      isShowRegionSelector: showSelector
    });
  }

  onEditBookDescription(e) {
    this.setState({
      description: e.target.value
    })
  }

  handleChange() {

  }

  handleRegionChange(e) {
    console.log(e);
    let info = e.detail;
    this.setState({
      regionValue: info.value
    });

    this.region = {
      province: { code: info.code[0], name: info.value[0] },
      city: { code: info.code[1], name: info.value[1] },
      district: { code: info.code[2], name: info.value[2] },
    }
  }

  config = {
    navigationBarTitleText: "藏书信息修改"
  };

  render() {
    const { book, region, holder, regionValue } = this.state;

    return (
      <View>
        <AtMessage />

        {book && (
          <Block>
            <BookPreviewHeader book={book} />

            <View className='book-extra'>
              <View className='book-extra__title'>藏书信息</View>
              <View className='at-col book-extra__info'>
                <View>藏书持有人：{holder.nickname}</View>
                <View>藏书位置：{region.province['name']} {region.city['name']} {region.district['name']}</View>
              </View>
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

                {/* region selector */}
                {this.state.isShowRegionSelector && (
                  <View className='panel'>
                    <View className='panel__title'>藏书所在地区</View>
                    <View className='panel__content'>
                      <View className='picker-item'>
                        <Picker mode='region'
                          onChange={this.handleRegionChange}
                          value={regionValue}
                        >
                          <View className='picker-list-item'>
                            <View className='picker-list-item__label'>选择地区</View>
                            <View className='picker-list-item__value'>{regionValue[0]} {regionValue[1]} {regionValue[2]}</View>
                          </View>
                        </Picker>
                      </View>
                    </View>
                  </View>
                )}

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
