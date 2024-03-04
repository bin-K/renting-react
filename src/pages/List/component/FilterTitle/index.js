import { Flex } from 'antd-mobile'
import React from 'react'
import styles from './index.module.css'

const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

export default class FilterTitle extends React.Component {
  render() {
    const { titleSelectedStatus, onClick } = this.props
    return (
      <Flex align="center" className={styles.root}>
        {

          titleList.map(item => {
            const isSelected = titleSelectedStatus[item.type]
            return (
              <Flex.Item key={item.type} onClick={() => onClick(item.type)}>
                {/* 选中类名：selected */}
                <span className={[styles.dropdown, isSelected ? styles.selected : ''].join(' ')}>
                  <span>{item.title}</span>
                  <i className={["iconfont icon-xialajiantou", isSelected ? styles.selected : ''].join(' ')}></i>
                </span>
              </Flex.Item>
            )
          })
        }
      </Flex>
    )
  }
}