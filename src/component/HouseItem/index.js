/**
 * 展示每一个房源的组件
 */
import React from 'react'

import styles from './index.module.css'

import PropTypes from 'prop-types'

export default class HouseItem extends React.Component {

  static propTypes = {
    src: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    tags: PropTypes.array.isRequired,
    price: PropTypes.number,
    onClick: PropTypes.func
  }

  render() {
    /**
     * src:房源图片的地址，title:房源的标题，desc：房源的描述，tags：房源的标签
     * price：价格，onClick：处理点击该房源时的事件，style：表示控制的样式
     */
    const { src, title, desc, tags, price, onClick, style } = this.props

    return (
      <div className={styles.house} onClick={onClick} style={style}>
        {/* 图片 */}
        <div className={styles.imgWrap}>
          <img
            className={styles.img}
            src={src}
            alt=""
          />
        </div>
        {/* 文字内容 */}
        <div className={styles.content}>
          <h3 className={styles.title}>
            {title}
          </h3>
          <div className={styles.desc}>{desc}</div>
          <div>
            {
              tags.map((tag, index) => {
                const tagIndex = 'tag' + (index % 3 + 1)
                return (
                  <span className={[styles.tag, styles[tagIndex]].join(' ')} key={tag}>
                    {tag}
                  </span>
                )
              })
            }
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{price}</span> 元/月
          </div>
        </div>

      </div>
    )
  }
}