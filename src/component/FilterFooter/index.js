/**
 * 筛选页面中的确认取消组件
 */

import React from "react"

import { Flex } from 'antd-mobile'
// 导入ProTypes对传入的props进行限制
import PropTypes from 'prop-types'
// 导入模块化的样式文件
import styles from './index.module.css'

export default class FilterFooter extends React.Component {
  //对传入的props进行限制
  static propTypes = {
    cancelText: PropTypes.string,
    okText: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    className: PropTypes.string
  }
  
  render() {
    // cancelText，okText是传入的文本,用以修改默认的确认、取消按钮的文本
    // onCancel,onOk是传入的事件，表示当点击相应的事件是时候，应该执行的事件
    // className 传入的样式，组件在不同的地方，样式的不同表现
    const { cancelText, okText, onCancel, onOk, className } = this.props;

    return (
      <Flex className={[styles.root, className || ''].join(' ')}>

        {/* 取消按钮 */}
        <span className={[styles.btn, styles.cancel].join(' ')} onClick={onCancel}>
          {cancelText ? cancelText : '取消'}
        </span>

        {/* 确定按钮 */}
        <span className={[styles.btn, styles.ok].join(' ')} onClick={onOk}>
          {okText ? okText : '确定'}
        </span>

      </Flex>
    )
  }
}