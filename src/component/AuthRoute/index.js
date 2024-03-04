/**
 * 自定义路由组件，设置导航守卫，用以判断用户在使用某些功能时是否已经登录
 */

import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuth } from '../../utils/auth'

export default class AuthRoute extends React.Component {
  render() {
    const { component: Component, ...rest } = this.props
    // 自定义路由的本质还是要返回一个普通的路由组件，但是需要对这个路由组件进行改造
    // 就是通过render方法，接收到对应的组件，通过一些条件决定这个组件怎么样才能渲染
    // 如果条件不通过，则将其重定向到需要展示的页面，通过Redirect，并且to中传递的是完整的对象，包含从哪里来的信息
    return <Route {...rest} render={props => {
      const isLogin = isAuth()
      if (isLogin) {
        return <Component {...props} />
      } else {
        return <Redirect to={{
          pathname: '/login',
          state: {
            from: props.location
          }
        }} />
      }
    }}></Route>
  }
}