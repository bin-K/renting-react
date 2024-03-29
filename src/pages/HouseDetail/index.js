import React, { Component } from 'react'

import { Carousel, Flex, Modal, Toast } from 'antd-mobile'

import NavHeader from '../../component/NavHeader'
import HousePackage from '../../component/HousePackage'

import { BASE_URL } from '../../utils/url'

import { isAuth } from '../../utils/auth'

import { API } from '../../utils/api'

import styles from './index.module.css'


const BMapGL = window.BMapGL;
// 覆盖物样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '14px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

const alert = Modal.alert;

export default class HouseDetail extends Component {
  state = {
    // 数据加载状态
    isLoading: false,
    // 房屋详情
    houseInfo: {
      houseImg: [],
      title: '',
      tags: [],
      price: 0,
      // 房型
      roomType: '',
      // 房屋面积
      size: 0,
      // 朝向
      oriented: [],
      // 楼层
      floor: '',
      // 小区名称
      community: '',
      // 地理位置
      coord: {
        latitude: '39.928033',
        longitude: '116.529466'
      },
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: '',
      // 房屋描述
      description: ''
    },
    // 房源是否被收藏
    isFavorite: false
  }

  // 获取房屋详情数据
  async getHouseDetail() {
    const { id } = this.props.match.params;

    this.setState({
      isLoading: true
    })

    const res = await API.get(`/houses/${id}`);
    this.setState({
      houseInfo: res.data.body,
      isLoading: false
    })

    // 获取数据，渲染地图
    const { community, coord } = res.data.body;
    this.renderMap(community, coord);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getHouseDetail();
    this.checkFavorite();
  }

  // 渲染轮播图组件
  renderSwipers() {
    const { houseImg } = this.state.houseInfo;
    return houseImg.map(item => (
      <a key={item} href="##" >
        <img src={BASE_URL + item} alt="" />
      </a>
    ))
  }

  // 渲染地图 
  renderMap(community, coord) {
    const { longitude, latitude } = coord;
    const map = new BMapGL.Map('map');
    const point = new BMapGL.Point(longitude, latitude);
    map.centerAndZoom(point, 17);

    // 创建覆盖物
    const label = new BMapGL.Label('', {
      position: point,
      offset: new BMapGL.Size(0, 0)
    });

    // 设置房源覆盖物内容
    label.setContent(`
            <div class="${styles.rect}">
                <span class="${styles.housename}">${community}</span>
                <i class="${styles.arrow}"></i>
            </div>
        `)

    // 设置样式
    label.setStyle(labelStyle);

    // 添加覆盖物到地图中
    map.addOverlay(label);
  }

  // 检查收藏状态
  async checkFavorite() {
    const isLogin = isAuth();
    if (isLogin) {
      // 从路由参数中获取房屋id
      const { id } = this.props.match.params;
      // 查询房屋是否被收藏
      const res = await API.get(`/user/favorites/${id}`);

      const { status, body } = res.data;
      if (status === 200) {
        // 请求成功
        this.setState({
          isFavorite: body.isFavorite
        })
      }
    } else {
      return
    }
  }

  // 收藏
  handleFavorite = async () => {
    const isLogin = isAuth();
    const { history, location, match } = this.props;

    if (isLogin) {
      // 已登录
      const { isFavorite } = this.state;
      const { id } = match.params;

      if (isFavorite) {
        // 取消收藏
        const res = await API.delete(`/user/favorites/${id}`);

        this.setState({
          isFavorite: false
        });

        if (res.data.status === 200) {
          Toast.info('已取消收藏', 1, null, false)
        } else {
          Toast.info('请求超时，请重新登录', 2, null, false)
        }
      } else {
        // 添加收藏
        const res = await API.post(`/user/favorites/${id}`);

        if (res.data.status === 200) {
          Toast.info('收藏成功', 1, null, false);
          this.setState({
            isFavorite: true
          });
        } else {
          Toast.info('请求超时，请重新登录', 2, null, false)
        }
      }
    } else {
      // 未登录
      return alert('提示', '该功能需要先登录，是否登录？', [
        { text: '否' },
        { text: '是', onPress: () => history.push('/login', { from: location }) }
      ])
    }

  }

  render() {
    const { isLoading,
      houseInfo: {
        community,
        title,
        tags,
        price,
        roomType,
        size,
        floor,
        oriented,
        supporting,
        description
      },
      isFavorite } = this.state;
    return (
      <div className={styles.root}>
        {/* 导航 */}
        <NavHeader
          className={styles.navHeader}
          rightContent={[<i key="share" className="iconfont icon-chakantiezifenxiang" />]}
        >
          {community}
        </NavHeader>

        {/* 轮播图 */}
        <div className={styles.slides}>
          {
            !isLoading ? (
              <Carousel autoplay infinite autoplayInterval={2000}>
                {this.renderSwipers()}
              </Carousel>
            ) : null
          }
        </div>

        {/* 房屋基本信息 */}
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>
            {title}
          </h3>
          <Flex className={styles.infoTags}>
            <Flex.Item>
              {
                tags.map((item, index) => (
                  <span key={item} className={[styles.tag, styles.tags, styles['tag' + (index % 4 + 1)]].join(' ')}>
                    {item}
                  </span>
                ))
              }
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoPrice} >
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                {price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{size}平方</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoBasic} align="start">
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                精装
              </div>
              <div>
                <span className={styles.title}>楼层：</span>
                {floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className={styles.title}>朝向：</span>
                {oriented.join('、')}
              </div>
              <div>
                <span className={styles.title}>类型：</span>
                普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>

        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区：
            <span>{title}</span>
          </div>
          <div className={styles.mapContainer} id="map">
            地图
          </div>
        </div>

        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
          {
            supporting.length === 0
              ? <div className={styles.titleEmpty}>暂无数据</div>
              : <HousePackage list={supporting} />
          }
        </div>

        {/* 房屋概况 */}
        <div className={styles.set}>
          <div className={styles.houseTitle}>房屋概况</div>
          <div>
            <div className={styles.contact}>
              <div className={styles.user}>
                <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                <div className={styles.userInfo}>
                  <div>张女士</div>
                  <div className={styles.userAuth}>
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className={styles.userMsg}>发消息</span>
            </div>
            <div className={styles.descText}>
              {description || '暂无房屋数据'}
            </div>
          </div>
        </div>
        {/* 底部按钮 */}
        <div className={styles.buttons}>
          <span className={styles.favorite} onClick={this.handleFavorite} >
            <img
              src={
                BASE_URL + (isFavorite ? '/img/star.png' : '/img/unstar.png')
              }
              alt="收藏"
            />
            {isFavorite ? '已收藏' : '收藏'}
          </span>
          <span className={styles.consult}>在线咨询</span>
          <span className={styles.reserve}>
            <a href="tel: 123456789">电话预定</a>
          </span>
        </div>
      </div>
    )
  }
}