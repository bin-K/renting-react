import React, { Component, lazy, Suspense } from 'react';
// 导入路由相关
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
// 导入两个页面
import AuthRoute from './component/AuthRoute';
// 路由懒加载，性能优化
const CityList = lazy(() => import('./pages/CityList'))
const Home = lazy(() => import('./pages/Home'))
const Map = lazy(() => import('./pages/Map'))
const HouseDetail = lazy(() => import('./pages/HouseDetail'))
const Login = lazy(() => import('./pages/Login'))
const Favorite = lazy(() => import('./pages/Favorite'))
const Register = lazy(() => import('./pages/Register'))
const Rent = lazy(() => import('./pages/Rent'))
const RentAdd = lazy(() => import('./pages/Rent/Add'))
const RentSearch = lazy(() => import('./pages/Rent/Search'))

class App extends Component {
  render() {
    return (
      <Router>
        {/* 路由懒加载，在页面没有加载出来前，先通过fallback提高用户体验 */}
        <Suspense fallback={<div className='route-loading'>loading....</div>}>
          {/* switch路由的模糊匹配，当有一个匹配成功之后就不再往下匹配了 */}
          <Switch>

            {/* 普通路由匹配 */}
            <Route exact path='/' render={() => <Redirect to='/home' />} />
            <Route path='/home' component={Home} />
            <Route path='/citylist' component={CityList} />
            <Route path='/detail/:id' component={HouseDetail} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />

            {/* 自定义路由匹配，加入导航守卫，判断用户是否已经登录 */}
            <AuthRoute path="/map" component={Map} />
            <AuthRoute path='/favorite' component={Favorite} />
            <AuthRoute exact path='/rent' component={Rent} />
            <AuthRoute path="/rent/add" component={RentAdd} />
            <AuthRoute path="/rent/search" component={RentSearch} />
            
          </Switch>
        </Suspense>
      </Router>
    );
  }
}
export default App;
