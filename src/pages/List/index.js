import { Flex, Toast } from 'antd-mobile'
import React from 'react'
import SearchHeader from '../../component/SearchHeader'
import styles from './index.module.css'
import Filter from './component/Filter'
import { API } from '../../utils/api'
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
import HouseItem from '../../component/HouseItem'
import Sticky from '../../component/Sticky'
import { BASE_URL } from '../../utils/url'
import NoHouse from '../../component/NoHouse'

import { getCurrentCity } from '../../utils/getCurrentCity_utils'

// const { label, value } = JSON.parse(localStorage.getItem('localCity'))


export default class HouseList extends React.Component {

  state = {
    list: [],
    count: 0,
    isLoading: false
  }

  label = ''
  value = ''
  filters = {}

  async componentDidMount() {
    const { label, value } = await getCurrentCity()
    this.label = label
    this.value = value
    this.searchList()
  }

  onFilter = (filters) => {
    window.scrollTo(0, 0)
    this.filters = filters
    this.searchList()
  }

  searchList = async () => {
    this.setState({
      isLoading: true
    })
    Toast.loading('加载中...', 0, null, false)
    const result = await API.get('/houses', {
      params: {
        cityId: this.value,
        ...this.filters,
        start: 1,
        end: 20
      }
    })
    const { count, list } = result.data.body
    Toast.hide()

    if (count !== 0) {
      //提示房源数量
      Toast.info(`共找到${count}套房源`, 2, null, false)
    }


    this.setState({
      count,
      list,
      isLoading: false
    })
  }

  rowRenderer = ({
    key,
    index,
    style,
  }) => {
    const { list } = this.state
    const house = list[index]
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading}></p>
        </div>
      )
    }
    return (
      <HouseItem
        onClick={() => this.props.history.push(`/detail/${house.houseCode}`)}
        key={key}
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      />
    );
  }

  isRowLoaded = ({ index }) => {
    return !!this.state.list[index];
  }

  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(resolve => {
      API.get('/houses', {
        params: {
          cityId: this.value,
          ...this.filters,
          start: startIndex,
          end: stopIndex
        }
      }).then(res => {
        this.setState({
          list: [...this.state.list, ...res.data.body.list]
        })
      })
    })
  }

  renderList = () => {
    const { count, isLoading } = this.state
    if (count === 0 && !isLoading) {
      return <NoHouse> 没有找到房源，请您换个搜索条件吧</NoHouse>
    }

    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    autoHeight
                    width={width}  // 视口宽度
                    height={height}  // 视口高度
                    rowCount={count} // 行数
                    rowHeight={120}  // 行高
                    rowRenderer={this.rowRenderer}  // 渲染每一行
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }
  render() {

    return (
      <div>
        <Flex className={styles.header}>
          <i className="iconfont icon-zuojiantou" onClick={() => { this.props.history.go(-1) }}></i>
          <SearchHeader cityName={this.label} className={styles.searchHeader} />
        </Flex>
        <Sticky height={40}>
          <Filter onFilter={this.onFilter} />
        </Sticky>

        {/* 房屋列表 */}
        <div className={styles.houseItems}>{this.renderList()}</div>
      </div>
    )
  }
}