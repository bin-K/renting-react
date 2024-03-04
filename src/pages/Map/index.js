import React from 'react'

import NavHeader from '../../component/NavHeader';

import styles from './index.module.css'
import { Link } from 'react-router-dom';
import { Toast } from 'antd-mobile';

import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url';

import HouseItem from '../../component/HouseItem';

const BMapGL = window.BMapGL
const labelStye = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontsize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

export default class Map extends React.Component {
  state = {
    houseList: [],
    isShowList: false,
  }

  componentDidMount() {
    this.initMap()
  }

  initMap = () => {
    const { label, value } = JSON.parse(localStorage.getItem('localCity'))
    // 在react脚手架中使用全局变量要加window
    const map = new BMapGL.Map("container")
    this.map = map
    map.centerAndZoom(new BMapGL.Point(116.331398, 39.897445), 12);
    //创建地址解析器实例
    var myGeo = new BMapGL.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(label, async (point) => {
      if (point) {
        map.centerAndZoom(point, 11);
        map.addControl(new BMapGL.ZoomControl())
        map.addControl(new BMapGL.ScaleControl())
        this.renderOverlays(value)
      } else {
        alert('您选择的地址没有解析到结果！');
      }
    }, label)
    map.addEventListener('movestart', () => {
      if (this.state.isShowList) {
        this.setState({
          isShowList: false
        })
      }
    })
  }
  // 渲染覆盖物入口
  // 接收区域ID，获取该区域下的房源信息
  // 获取房源类型以及下级地图的缩放级别
  async renderOverlays(id) {
    try {
      Toast.loading('Loading...', 0, null, false);
      const result = await API.get(`/area/map?id=${id}`)
      Toast.hide()
      const { nextZoom, type } = this.getTypeAndZoom()
      return result.data.body.forEach(item => {
        // 创建覆盖物
        this.createOverlays(item, nextZoom, type)
      })
    } catch (error) {
      Toast.hide()
      Toast.fail('Load failed !!!', 1);
    }
  }

  getTypeAndZoom() {
    // 调用getZoom,获取缩放级别
    const zoom = this.map.getZoom()
    let nextZoom, type
    if (zoom >= 10 && zoom < 12) {
      nextZoom = 13
      type = 'circle'
    } else if (zoom >= 12 && zoom < 14) {
      nextZoom = 15
      type = 'circle'
    } else if (zoom >= 14 && zoom < 16) {
      type = 'rect'
    }
    return { nextZoom, type }
  }

  createOverlays(data, zoom, type) {
    const { coord: { longitude, latitude }, label: areaName, count, value } = data
    const areaPoint = new BMapGL.Point(longitude, latitude)
    if (type === 'circle') {
      this.createCircle(areaPoint, areaName, count, value, zoom)
    } else {
      this.createRect(areaPoint, areaName, count, value, zoom)
    }
  }

  createCircle(point, name, count, id, zoom) {
    const label = new BMapGL.Label('', {
      position: point, // 设置标注的地理位置
      offset: new BMapGL.Size(-35, -35)           // 设置标注的偏移量
    })
    label.id = id
    label.setContent(`
            <div class="${styles.bubble}">
              <p class="${styles.name}">${name}</p>
              <p>${count}</p>
            </div>
        `)

    label.setStyle(labelStye)

    label.addEventListener('click', () => {
      this.renderOverlays(id)
      this.map.centerAndZoom(point, zoom)
      this.map.clearOverlays()
    })
    this.map.addOverlay(label);
  }

  createRect(point, name, count, id) {
    const label = new BMapGL.Label('', {
      position: point, // 设置标注的地理位置
      offset: new BMapGL.Size(-50, -28)           // 设置标注的偏移量
    })
    label.id = id

    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.houseName}">${name}</span>
        <span class="${styles.houseNum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)

    label.setStyle(labelStye)

    label.addEventListener('click', (e) => {
      console.log(e);
      const { clientX, clientY } = e.domEvent
      this.getHousesList(id)
      this.map.panBy(
        window.innerWidth / 2 - clientX,
        (window.innerHeight - 330) / 2 - clientY
      )
    })
    this.map.addOverlay(label);
  }

  async getHousesList(id) {
    try {
      Toast.loading('Loading...', 0, null, false);
      const result = await API.get(`/houses?cityId=${id}`)
      Toast.hide()
      this.setState({
        houseList: result.data.body.list,
        isShowList: true
      })
    } catch (error) {
      Toast.hide()
      Toast.fail('Load failed !!!', 1);
    }
  }

  renderHouseList = () => {
    return this.state.houseList.map(item =>
      <HouseItem
        onClick={() => this.props.history.push(`/detail/${item.houseCode}`)}
        key={item.houseCode}
        src={BASE_URL + item.houseImg}
        title={item.title}
        desc={item.desc}
        tags={item.tags}
        price={item.price}
      />
    )
  }

  render() {
    return (
      <div className={styles.map}>
        {/* 导航栏 */}
        <NavHeader>
          地图找房
        </NavHeader>
        <div id="container" className={styles.container}></div>
        {/* 房源列表 */}
        <div className={[styles.houseList, this.state.isShowList ? styles.show : ''].join(' ')}>
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              更多房源
            </Link>
          </div>
          <div className={styles.houseItems}>
            {this.renderHouseList()}
          </div>
        </div>
      </div>
    )
  }
}