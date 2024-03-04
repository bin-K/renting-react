import React,{lazy} from 'react'
import { Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile';
import './index.css'

// import News from '../News'
// import HouseList from '../List'
// import Profile from '../Profile'

import Index from '../Index'
const News = lazy(() => import('../News'))
const HouseList = lazy(() => import('../List'))
const Profile = lazy(() => import('../Profile'))

const tabItems = [
  {
    title: '首页',
    icon: 'icon-shouye',
    path: '/home'
  },
  {
    title: '找房',
    icon: 'icon-chazhaobiaodanliebiao',
    path: '/home/list'
  },
  {
    title: '资讯',
    icon: 'icon-zixun',
    path: '/home/news'
  },
  {
    title: '我的',
    icon: 'icon-wode',
    path: '/home/profile'
  }
]

export default class Home extends React.Component {
  state = {
    //选中的Tab选项
    selectedTab: this.props.location.pathname,
  };
  componentDidUpdate(preProps) {
    if (preProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }
  //  遍历TabBar，使代码更加整洁
  renderTabBarItem() {
    // eslint-disable-next-line
    return tabItems.map(item =>
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={
          <i className={`iconfont ${item.icon}`}></i>
        }
        selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path,
          });
          this.props.history.push(item.path)
        }}
      >
      </TabBar.Item>
    )
  }
  render() {
    return (
      <div className='home'>
          <Route exact path='/home' component={Index}></Route>
          <Route path='/home/list' component={HouseList}></Route>
          <Route path='/home/news' component={News}></Route>
          <Route path='/home/profile' component={Profile}></Route>
        <div>
          <TabBar
            tintColor="#21b97a"
            barTintColor="white"
            noRenderContent
          >
            {this.renderTabBarItem()}
          </TabBar>
        </div>
      </div>
    )
  }
}