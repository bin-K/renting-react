import { PickerView } from 'antd-mobile'
import React from 'react'
import FilterFooter from '../../../../component/FilterFooter'




export default class FilterPicker extends React.Component {
  state = {
    value: this.props.defaultValue
  }
  render() {
    const { onCancel, onSave, data, cols, type } = this.props
    const { value } = this.state
    return (
      <>
        {/* 选择器组件 */}
        <PickerView data={data} value={value} cols={cols} onChange={(value) => {
          this.setState({
            value
          })
        }} />
        {/* 底部按钮 */}
        <FilterFooter onCancel={() => { onCancel(type) }} onOk={() => { onSave(type, value) }} />
      </>
    )
  }
}