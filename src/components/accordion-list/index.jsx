import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAccordion, AtList, AtListItem  } from 'taro-ui'

import URL from "../../constants/urls";

import "./index.scss";

export default class AccordionList extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    title: '',
    sharingType: 'sharing',
    data: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      isAccordionOpened: true,
    }
  }

  componentWillMount() {}

  onClickAccordion (value) {
    this.setState({
      isAccordionOpened: value
    });
  }

  onClickItem(sharingId) {
    Taro.navigateTo({'url': `${URL.SHARING_DETAIL}?id=${sharingId}&type=${this.props.sharingType}`});
  }

  render() {
    const { title, data } = this.props;
    const { isAccordionOpened } = this.state;

    return (
      <View>
        <AtAccordion
          open={isAccordionOpened}
          title={title}
          onClick={this.onClickAccordion.bind(this)}
        >
          <AtList hasBorder={false}>
            {data.map(item => {
              return (
                <AtListItem
                  key={item.id}
                  title={item.title}
                  note={item.note}
                  thumb={item.thumb}
                  onClick={this.onClickItem.bind(this, item.id)}
                />
              );
            })}
          </AtList>
        </AtAccordion>
      </View>
    );
  }
}
