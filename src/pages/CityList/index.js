import React from 'react'

import { Toast } from 'antd-mobile'
import styles from './index.module.css'
// import './index.scss'

import { API } from '../../utils/api'

import { getCurrentCity } from '../../utils/getCurrentCity_utils'

import { List, AutoSizer } from 'react-virtualized';

import  NavHeader  from '../../component/NavHeader'

const formatCityData = (list) => {
  const cityList = {}
  // 遍历数据
  list.forEach(item => {
    const first = item.short.substr(0, 1)
    if (cityList[first]) {
      cityList[first].push(item)
    } else {
      cityList[first] = [item]
    }
  });
  const cityIndex = Object.keys(cityList).sort()
  return {
    cityList,
    cityIndex
  }
}
const formatCityIndex = (letter) => {
  switch (letter) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return letter.toUpperCase()
  }
}

const TITLE_HEIGHT = 36
const NAME_HEIGHT = 50
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

export default class CityList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityIndex: [],
      cityList: {},
      activeIndex: 0
    }
    this.cityListComponent = React.createRef()
  }

  async componentDidMount() {
    await this.getCityList()
    // 提前计算高度，解决scrollToRow在未渲染组件中出现的定位问题
    this.cityListComponent.current.measureAllRows()
  }

  async getCityList() {
    const result = await API.get('/area/city?level=1')
    const { cityList, cityIndex } = formatCityData(result.data.body)
    const hotCity = await API.get('/area/hot')
    cityIndex.unshift('hot')
    cityList['hot'] = hotCity.data.body
    const curCity = await getCurrentCity()
    cityList['#'] = [curCity]
    cityIndex.unshift('#')
    this.setState({
      cityIndex,
      cityList
    })
  }

  changeCity = ({ label, value }) => {
    if (HOUSE_CITY.indexOf(label) > -1) {
      localStorage.setItem('localCity', JSON.stringify({ label, value }))
      this.props.history.go(-1)
    } else {
      Toast.info('该城市暂无房源信息', 1, null, false);
    }
  }

  rowRenderer = ({
    key,
    index,
    isScrolling,
    isVisible,
    style,
  }) => {
    const { cityIndex, cityList } = this.state
    const letter = cityIndex[index]

    return (
      <div key={key} style={style} className={styles.city}>
        <div className={styles.title}>{formatCityIndex(letter)}</div>
        {
          cityList[letter].map(item =>
            <div className={styles.name} key={item.value} onClick={() => this.changeCity(item)}>
              {item.label}
            </div>
          )
        }
      </div>
    );
  }

  getRowHeight = ({ index }) => {
    const { cityIndex, cityList } = this.state
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  }

  //封装渲染右侧索引列表的方法
  renderCityIndex = () => {
    const { cityIndex, activeIndex } = this.state
    //获取到 cityIndex，并遍历其，实现渲染
    return cityIndex.map((item, index) =>
      <li className={styles['city-index-item']} key={item} onClick={() => {
        this.cityListComponent.current.scrollToRow(index)
      }}>
        <span
          className={activeIndex === index ? styles['index-active'] : ''}
        >
          {item === 'hot' ? '热' : item.toUpperCase()}
        </span>
      </li>
    )
  }

  // 滚动高亮
  onRowsRendered = ({ startIndex }) => {
    const { activeIndex } = this.state
    if (activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex
      })
    }
  }
  render() {
    return (
      <div className={styles.cityList}>
        {/* 顶部导航栏 */}
        <NavHeader>
          城市选择
        </NavHeader>
        {/* 城市列表 */}
        <AutoSizer>
          {
            ({ width, height }) => (
              <List
                ref={this.cityListComponent}
                width={width}
                height={height}
                rowCount={this.state.cityIndex.length}
                rowHeight={this.getRowHeight}
                rowRenderer={this.rowRenderer}
                onRowsRendered={this.onRowsRendered}
                scrollToAlignment='start'
              />
            )
          }
        </AutoSizer>
        {/* 标签定位栏 */}
        <ul className={styles['city-index']}>
          {this.renderCityIndex()}
        </ul>
      </div>
    )
  }
}