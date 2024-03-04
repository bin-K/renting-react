import React from 'react'
import FilterMore from '../FilterMore'
import FilterPicker from '../FilterPicker'
import FilterTitle from '../FilterTitle'
import { API } from '../../../../utils/api'
import styles from './index.module.css'
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}
export default class Filter extends React.Component {
  state = {
    titleSelectedStatus,
    // 控制picker和more是否隐藏
    openType: '',
    // 筛选条件数据
    filterData: {},
    selectedValues
  }

  componentDidMount() {
    this.htmlBody = document.body
    this.getFilterData()

  }

  getFilterData = async () => {
    const { value } = JSON.parse(localStorage.getItem('localCity'))
    const result = await API.get(`/houses/condition?id=${value}`)
    this.setState({
      filterData: result.data.body
    })
  }

  renderFilterPicker = () => {
    const {
      openType,
      filterData: { area, subway, rentType, price },
      selectedValues
    } = this.state
    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }
    let data = []
    let cols = 3
    let defaultValue = selectedValues[openType]
    switch (openType) {
      case 'area':
        data = [area, subway]
        break
      case 'mode':
        data = rentType
        cols = 1
        break
      case 'price':
        data = price
        cols = 1
        break
      default:
        break
    }
    return <FilterPicker
      key={openType}
      onCancel={this.onCancel}
      onSave={this.onSave}
      data={data} cols={cols}
      type={openType}
      defaultValue={defaultValue}
    />
  }

  renderFilterMore = () => {
    const {
      openType,
      selectedValues,
      filterData: { roomType, oriented, floor, characteristic } } = this.state
    if (openType !== 'more') {
      return null
    }
    const data = {
      roomType, oriented, floor, characteristic
    }
    const defaultValue = selectedValues.more
    return <FilterMore
      data={data} type={openType}
      onSave={this.onSave}
      onCancel={this.onCancel}
      defaultValue={defaultValue}
    />
  }

  onTitleClick = (type) => {
    //给body添加样式
    this.htmlBody.className = 'body-fixed'

    const { titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    Object.keys(titleSelectedStatus).forEach(key => {
      if (key === type) {
        newTitleSelectedStatus[type] = true
        return
      }
      const selectedVal = selectedValues[key]
      if (key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'more' && selectedVal.length !== 0) {
        newTitleSelectedStatus[key] = true
      } else {
        newTitleSelectedStatus[key] = false
      }
    })
    this.setState({
      openType: type,
      titleSelectedStatus: newTitleSelectedStatus
    })
  }

  onCancel = (type) => {
    this.htmlBody.className = ' '
    const { titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const selectedVal = selectedValues[type]
    if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }
    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
      openType: ''
    })
  }

  onSave = (type, value) => {
    this.htmlBody.className = ' '
    const { titleSelectedStatus } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const selectedVal = value
    if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }

    const newSelectedValue = {
      ...this.state.selectedValues,
      [type]: value
    }

    const { area, mode, price, more } = newSelectedValue
    const filters = {}
    // 区域
    const areaKey = area[0]
    let areaValue = 'null'
    if (area.length === 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    }

    //方式和租金
    filters.mode = mode[0]
    filters.price = price[0]
    filters.more = more.join(',')
    filters[areaKey] = areaValue

    this.props.onFilter(filters)
    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus,
      selectedValues: newSelectedValue,
    })
  }
  render() {
    const { titleSelectedStatus, openType } = this.state
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        {
          (openType === 'area' || openType === 'mode' || openType === 'price')
            ?
            <div className={styles.mask}
              onClick={() => this.onCancel(openType)}>
            </div>
            : null
        }

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick} />

          {/* 前三个菜单对应的表格 */}
          {this.renderFilterPicker()}


          {/* 最后一个菜单对应的内容 */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}