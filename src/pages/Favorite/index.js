import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'

import HouseItem from '../../component/HouseItem'
import NavHeader from '../../component/NavHeader'
import NoHouse from '../../component/NoHouse'

import styles from './index.module.css'
import { Toast } from 'antd-mobile'

export default class MyFavorite extends Component {
  state = {
    // 收藏房屋列表
    list: [],
    isLoading: false
  }

  // 获取已收藏房源列表信息
  async getHouseList() {
    this.setState({
      isLoading: true
    })

    Toast.loading('Loading...', 0, null, false);
    const res = await API.get('/user/favorites');

    Toast.hide();
    this.setState({
      isLoading: false
    })
    const { status, body } = res.data;
    if (status === 200) {
      this.setState({
        list: body
      })
    } else {
      const { history, location } = this.props;
      history.replace('/login', {
        from: location
      })
    }
  }

  componentDidMount() {
    this.getHouseList();
  }

  renderHouseItem() {
    const { list } = this.state;
    const { history } = this.props;
    return list.map(item => (
      <HouseItem
        key={item.houseCode}
        src={BASE_URL + item.houseImg}
        onClick={() => history.push(`/detail/${item.houseCode}`)}
        title={item.title}
        desc={item.desc}
        tags={item.tags}
        price={item.price}
      />
    ))
  }

  renderHouseList() {
    const { list, isLoading } = this.state;

    if (list.length === 0 && !isLoading) {
      return (
        <NoHouse>
          您还没有收藏房源,<Link to='/home/list' className={styles.link}>去看看房源吧~</Link>
        </NoHouse>
      )
    } else {
      return <div className={styles.houses}>{this.renderHouseItem()}</div>
    }
  }

  render() {
    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={() => this.props.history.goBack()}>我的收藏</NavHeader>
        {this.renderHouseList()}
      </div>
    )
  }
}