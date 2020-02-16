import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtPagination } from 'taro-ui'

import PrintBookCard from "../../components/printbook-card";

import "./index.scss";

export default class PrintBookPagination extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    printBooks: [],
    totalPages: 1,
    perPage: 1,
    currentPage: 1,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  onPageChange(data) {
    this.props.onPageChange(data);
  }

  render() {
    const { printBooks, totalPages, perPage, currentPage } = this.props;
    // console.log(totalPages, perPage, currentPage);

    return (
      <View>
        {printBooks.map(item => (
          <PrintBookCard data={item} key={item.id} />
        ))}
        <AtPagination 
          total={totalPages} 
          pageSize={perPage} 
          current={currentPage}
          onPageChange={this.onPageChange.bind(this)}
        >
        </AtPagination>
      </View>
    );
  }
}
