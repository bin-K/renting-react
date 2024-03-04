import React from 'react'
import FilterFooter from '../../../../component/FilterFooter'
import styles from './index.module.css'
export default class FilterMore extends React.Component {
  state = {
    selectedValues: this.props.defaultValue
  }
  onTagClick = (value) => {
    const { selectedValues } = this.state
    const newSelectedValues = [...selectedValues]
    if (selectedValues.indexOf(value) <= -1) {
      newSelectedValues.push(value)
    } else {
      const index = newSelectedValues.findIndex(item => item === value)
      newSelectedValues.splice(index, 1)
    }
    this.setState({
      selectedValues: newSelectedValues
    })
  }
  renderFilter = (data) => {
    const { selectedValues } = this.state

    return data.map(item => {
      const isSelected = selectedValues.indexOf(item.value) > -1
      return (
        <span key={item.value} className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')} onClick={() => {
          this.onTagClick(item.value)
        }}>{item.label}</span>
      )
    })
  }
  onCancel = () => {
    this.setState({
      selectedValues:[]
    })
  }

  onOk = () => {
    const { type, onSave } = this.props
    const { selectedValues } = this.state
    onSave(type, selectedValues)
  }
  render() {
    const {
      onCancel,
      type,
      data: { roomType, oriented, floor, characteristic }
    } = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick = {()=>onCancel(type)}></div>
        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.name}>户型</dt>
            <dd className={styles.child}>{this.renderFilter(roomType)}</dd>

            <dt className={styles.name}>朝向</dt>
            <dd className={styles.child}>{this.renderFilter(oriented)}</dd>

            <dt className={styles.name}>楼层</dt>
            <dd className={styles.child}>{this.renderFilter(floor)}</dd>

            <dt className={styles.name}>房屋亮点</dt>
            <dd className={styles.child}>{this.renderFilter(characteristic)}</dd>
          </dl>
        </div>
        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          cancelText="清除"
          onCancel={this.onCancel}
          onOk = {this.onOk}
        />
      </div>
    )
  }
}