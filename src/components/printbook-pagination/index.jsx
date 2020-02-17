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
    totalCount: 1,
    perPage: 1,
    currentPage: 1,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentDidMount() {}

  onPageChange(data) {
    this.props.onPageChange(data);
  }

  render() {
    const { printBooks } = this.props;
    const { totalCount, perPage, currentPage } = this.props;
    // console.log(printBooks);
    // console.log(totalCount, perPage, currentPage);

    return (
      <View>
        {printBooks.map(item => (
          <PrintBookCard data={item} key={item.id} />
        ))}
        <AtPagination 
          total={totalCount} 
          pageSize={perPage} 
          current={currentPage}
          onPageChange={this.onPageChange.bind(this)}
        >
        </AtPagination>
      </View>
    );
  }
}
