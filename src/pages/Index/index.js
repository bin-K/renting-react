import React from 'react'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';

import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url';
import './index.scss'
import { getCurrentCity } from '../../utils/getCurrentCity_utils'
import SearchHeader from '../../component/SearchHeader';
// Nav数据
const NavItems = [
  {
    id: '1',
    title: '整租',
    icon: 'icon-shouye1',
    path: '/home/list'
  },
  {
    id: '2',
    title: '合租',
    icon: 'icon-lianxiren',
    path: '/home/list'
  },
  {
    id: '3',
    title: '地图找房',
    icon: 'icon-ditu',
    path: '/map'
  },
  {
    id: '4',
    title: '出租',
    icon: 'icon-chuzuwu',
    path: '/rent/add'
  }
]

export default class Index extends React.Component {
  state = {
    // 轮播图状态数据
    swipers: [],
    // 判断轮播图数据是否加载完成
    isSwiperLoaded: false,
    // 租房小组数据
    groups: [],
    // 最新资讯数据
    news: [],
    // 当前城市名称
    currentCity: '深圳'
  }
  // 获取轮播图数据
  async getSwipers() {
    const result = await API.get('/home/swiper')
    this.setState({
      swipers: result.data.body,
      isSwiperLoaded: true
    })
  }
  //获取租房小组数据
  async getGroups() {
    const result = await API.get('/home/groups', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    this.setState({
      groups: result.data.body,
    })
  }
  // 获取最新资讯数据
  async getNews() {
    const result = await API.get('/home/news', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    this.setState({
      news: result.data.body
    })
  }
  async componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()
    const current = await getCurrentCity()
    this.setState({
      currentCity: current.label
    })
  }
  // 渲染轮播图结构
  renderSwipers() {
    return this.state.swipers.map(item => (
      // eslint-disable-next-line
      <a
        key={item.id}
        href="#"
        style={{ display: 'block', width: '100%' }}
      >
        <img
          src={BASE_URL + item.imgSrc}
          alt=""
          style={{ width: '100%', verticalAlign: 'top', height: 212 }}
        />
      </a>
    ))
  }
  // 渲染nav结构
  renderNav() {
    return NavItems.map((item) => (
      <Flex.Item key={item.id} onClick={() => { this.props.history.push(item.path) }}>
        <i className={`iconfont ${item.icon}`}></i>
        <h2>{item.title}</h2>
      </Flex.Item>
    ))
  }
  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={BASE_URL + item.imgSrc}
            alt="" />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }
  render() {
    return (
      <div className="index">
        {/* swiper区 */}
        <div className='swiper'>
          {
            this.state.isSwiperLoaded ?
              <Carousel autoplay={true} infinite autoplayInterval={2000}>
                {this.renderSwipers()}
              </Carousel> :
              ''
          }
          {/* 搜索框 */}
          <SearchHeader cityName={this.state.currentCity }/>
        </div>
        {/* nav区 */}
        <Flex className='nav'>
          {this.renderNav()}
        </Flex>
        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组<span className="more">更多</span>
          </h3>
          <Grid data={this.state.groups}
            columnNum={2} square={false}
            hasLine={false} renderItem={(item) =>
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span></div>
                <img src={BASE_URL + item.imgSrc} alt="" />
              </Flex>
            } />
        </div>
        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">
            {this.renderNews()}
          </WingBlank>
        </div >
      </div>
    )
  }
}