import React from 'react';
// 导入虚拟DOM
import ReactDOM from 'react-dom';
// 导入antd-mobile的样式文件
import 'antd-mobile/dist/antd-mobile.css'
// 导入字体文件
import './assets/font/iconfont.css'
// 导入react-virtualized样式，react-virtualized用于加载长列表
import 'react-virtualized/styles.css'

import App from './App';
// 导入全局样式，为避免被antd的样式库对全局样式进行修改，在其后面导入
import './index.css'

ReactDOM.render( <App />,document.getElementById('root'));

