import React from "react";
import { Flex } from "antd-mobile";
import './index.scss'
import { withRouter } from 'react-router-dom'
import {PropTypes} from 'prop-types'
class SearchHeader extends React.Component {

  static propTypes = {
    cityName:PropTypes.string.isRequired
  }
  render() {
    const { cityName, history,className } = this.props
    return (
      <div>
        <Flex className={["search-box",className || ''].join(' ')}>
          {/* 左侧白色区域 */}
          <Flex className="search">
            {/* 定位 */}
            <div className="location" onClick={() => history.push('/citylist')}>
              <span className="name">{cityName}</span>
              <i className="iconfont icon-xialajiantou"></i>
            </div>
            {/* 搜索 */}
            <div className="form" onClick={() => history.push('/rent/search')}>
              <i className="iconfont icon-sousuo"></i>
              <input type="text" placeholder="请输入小区或地址" />
            </div>
          </Flex>
          {/* 右侧地图图标 */}
          <i className="iconfont icon-ditu" onClick={() => history.push('/map')}></i>
        </Flex>
      </div>
    )
  }
}

export default withRouter(SearchHeader)