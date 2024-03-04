import React, { createRef } from "react"
import styles from './index.module.css'
import PropTypes from 'prop-types'

export default class Sticky extends React.Component {

  static propTypes = {
    height: PropTypes.number.isRequired
  }

  placeholder = createRef()
  content = createRef()

  handleScroll = () => {
    const {height} = this.props
    const placeholderEl = this.placeholder.current
    const contentEl = this.content.current

    const { top } = placeholderEl.getBoundingClientRect()
    if (top < 0) {
      contentEl.classList.add(styles.fixed)
      placeholderEl.style.height = `${height}px`
    } else {
      contentEl.classList.remove(styles.fixed)
      placeholderEl.style.height = '0px'
    }
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
  render() {
    return (
      <div>
        {/*占位元素*/}
        <div ref={this.placeholder} />
        {/*内容元素*/}
        <div ref={this.content}>{this.props.children}</div>
      </div>
    )
  }
}