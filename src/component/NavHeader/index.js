import React from 'react'
import { withRouter } from 'react-router-dom'
import { NavBar } from 'antd-mobile'

import PropTypes from 'prop-types'

import style from './index.module.css'

class NavHeader extends React.Component {

  static propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func,
    className: PropTypes.string,
    rightContent: PropTypes.array

  }
  render() {
    const { children, history, onLeftClick, className, rightContent } = this.props
    const defaultHandler = () => history.go(-1)
    return (
      <NavBar
        className={[style.navBar, className || ''].join(' ')}
        mode="light"
        icon={<i className="iconfont icon-zuojiantou"></i>}
        onLeftClick={onLeftClick || defaultHandler}
        rightContent={rightContent}
      >
        {children}
      </NavBar>
    )
  }
}

export default withRouter(NavHeader)