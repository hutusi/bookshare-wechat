import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text, Block, Label } from "@tarojs/components";
import { AtForm, AtRadio, AtButton, AtTextarea } from "taro-ui";
import moment from 'moment';

import API from '../../services/api';
import user from '../../services/user';

import "./index.scss";

export default class SharingDetail extends Component {
  constructor() {
    super(...arguments);
    this.onPreview = this.onPreview.bind(this);
    this.fetchInfo = this.fetchInfo.bind(this);
    this.getSubmit = this.getSubmit.bind(this);
  }

  state = {
    sharingAction: 'accept',
  };

  componentWillMount () {
    this.fetchInfo();
  }

  componentDidMount() {
  }

  fetchInfo() {
    this.sharingId = this.$router.params.id;

    API.get(`/sharings/${this.sharingId}`).then(res => {
      console.log(res, user.userId)
      this.originReply = res.data.application_reply;
      let stateData = res.data['sharing'];
      stateData['submitButton'] = this.getSubmit(stateData);
      this.setState(stateData);
    }).catch(err => {
      console.error(err);
    });
  }

  onSelectSharingAction(value) {
    this.setState({
      sharingAction: value
    })
  }

  onEditApplicationReply(e) {
    this.setState({
      application_reply: e.target.value
    })
  }

  getSubmit(sharing) {
    let submitButton = {enabled: true, visible: false};

    if (!user) { /* no login */
    } else if (sharing.holder_id == user.userId) {
      if (sharing.status == 'requesting') {
        submitButton.visible = true;
        submitButton.text = '确认';
        submitButton.onClick = this.onSubmitAcceptReject.bind(this);
      } else if (sharing.status == 'accepted'){
        submitButton.visible = true;
        submitButton.text = '书已借出';
        submitButton.onClick = this.onSubmitLend.bind(this);
      } else {
      }
    } else if (sharing.receiver_id == user.userId) {
      if (sharing.status == 'lending') {
        submitButton.visible = true;
        submitButton.text = '书已收到';
        submitButton.onClick = this.onSubmitBorrow.bind(this);
      } else {
      }
    } else {
    }

    return submitButton;
  }

  onSubmitAcceptReject() {
    let action = this.state.sharingAction;
    API.post(`/sharings/${this.state.id}/${action}`, { 'application_reply': this.state.application_reply}
            ).then(res => {
      // console.log(res)
      Taro.navigateBack({ delta: 1 });
    }).catch(err => {
      console.error(err);
      Taro.atMessage({
        'message': err,
        'type': 'warning',
      })
    });
  }

  onSubmitLend() {
    API.post(`/sharings/${this.state.id}/lend`).then(res => {
      // console.log(res)
      Taro.navigateBack({ delta: 1 });
    }).catch(err => {
      console.error(err);
      Taro.atMessage({
        'message': err,
        'type': 'warning',
      })
    });
  }

  onSubmitBorrow() {
    API.post(`/sharings/${this.state.id}/borrow`).then(res => {
      // console.log(res)
      Taro.navigateBack({ delta: 1 });
    }).catch(err => {
      console.error(err);
      Taro.atMessage({
        'message': err,
        'type': 'warning',
      })
    });
  }

  onReset() {
    this.setState({
      sharingAction: 'accept',
      application_reply: ''
    });
  }

  onPreview() {
    let { cover } = this.state.book.book;
    Taro.previewImage({
      current: cover,
      urls: [cover]
    });
  }

  config = {
    navigationBarTitleText: "借书/分享申请"
  };

  render() {
    const { book, receiver, holder, created_at } = this.state;

    return (
      <View>
        {book && (
          <Block>
            <View className='at-row at-row__align--start book'>
              <View className='at-col book__info'>
                <View className='book__info-title'>{book.title}</View>
                <View>作者：{book.author_name}</View>
                <View>出版社：{book.publisher_name}</View>
                <View>申请借书人：{receiver.nickname}</View>
                <View>申请状态：{this.state.status}</View>
                <View>申请时间：{moment(created_at).format('YYYY-MM-DD hh:mm:ss')}</View>
              </View>
              <Image
                className='at-col at-col--auto book__img'
                src={book.cover}
                mode='widthFix'
                onClick={this.onPreview}
              />
            </View>

            <View className='doc-body'>
              <View className='panel'>
                <View className='panel__title'>申请</View>
                <View className='panel__content no-padding'>
                  <View className='at-article__h3'>借书人: {receiver.nickname}</View>
                  <View className='at-article__p'>
                    备注: {this.state.application_reason}
                  </View>
                </View>

                {this.state.holder_id == user.userId && this.state.status == 'requesting' && (
                <View>
                  <View className='panel__title'>确认意见</View>
                  <View className='panel__content no-padding'>
                    <AtRadio
                      options={[
                        { label: '同意', value: 'accept' },
                        { label: '拒绝', value: 'reject' }
                      ]}
                      value={this.state.sharingAction}
                      onClick={this.onSelectSharingAction.bind(this)}
                    />
                  </View>
  
                  <View className='panel__title'>确认备注</View>
                  <View className='panel__content'>
                    <View className='text-item'>
                      <AtTextarea
                        value={this.state.application_reply ? this.state.application_reply : ''}
                        onChange={this.onEditApplicationReply.bind(this)}
                        maxLength={200}
                        placeholder='请填写取书地址或其他备注信息，拒绝请填写理由...'
                      />
                    </View>
                  </View>
                </View>
                )}

                {this.state.receiver_id == user.userId && (
                <View>
                  <View className='panel__title'>确认意见</View>
                  <View className='panel__content no-padding'>
                    <View className='at-article__h3'>确认人: {holder.nickname}</View>
                    <View className='at-article__h3'>确认结果: {this.state.status}</View>
                    <View className='at-article__p'>
                      备注: {this.state.application_reply}
                    </View>
                  </View>
                </View>
                )}
              </View>

              {this.state.submitButton && this.state.submitButton.visible && (
              <AtButton type='primary' onClick={this.state.submitButton.onClick.bind(this)} >{this.state.submitButton.text}</AtButton>
              )}
              {this.state.holder_id == user.userId && this.state.status == 'requesting' && (
              <AtButton type='secondary' onClick={this.onReset.bind(this)} >重置</AtButton>
              )}
            </View>

          </Block>
        )}
      </View>
    );
  }
}
