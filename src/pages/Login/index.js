import React, { Component } from 'react'

import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'
// 引入withFormik高阶组件，用于表单校验
// import { withFormik, Form, Field, ErrorMessage } from 'formik'
import {withFormik,Form,Field,ErrorMessage } from 'formik'
// 导入yup
// import * as yup from 'yup'
import * as Yup from 'yup'
import { API } from '../../utils/api'
import NavHeader from '../../component/NavHeader'

import styles from './index.module.css'

// 校验规则
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/;
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/;

class Login extends Component {
  state = {
    username: '',
    password: ''
  }

  render() {
    return (
      <div className={styles.root}>
        <NavHeader className={styles.navHeader} >
          账号登录
        </NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        {/* 左右留白 */}
        <WingBlank>
          <Form className={styles.form} >
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              ></Field>
            </div>
            <ErrorMessage className={styles.error} name="username" component="div"></ErrorMessage>
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              ></Field>
            </div>
            <ErrorMessage className={styles.error} name="password" component="div"></ErrorMessage>
            <div className={styles.formSubmit}>
              <button
                className={styles.submit}
                type="submit"
              >登  录</button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/register">没有账号？去注册</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}


Login = withFormik({
  // 为Login组件提供状态
  mapPropsToValues: () => ({ username: '', password: '' }),
  // 添加校验规则 
  validationSchema: Yup.object().shape({
    username: Yup.string().required('账号必填').matches(REG_UNAME, '账号长度为5~8位，只能由数字、字母、下划线组成'),
    password: Yup.string().required('密码必填').matches(REG_PWD, '密码长度为5~12位，只能由数字、字母、下划线组成'),
  }),
  // 为Login提供表单提交方法
  handleSubmit: async (values, { props }) => {
    // 获取账号、密码
    const { username, password } = values;
    const res = await API.post('/user/login', {
      username,
      password
    });

    // 获取返回数据
    const { status, body, description } = res.data;
    if (status === 200) {
      // 登录成功
      // 将token存储到本地
      localStorage.setItem('Renting_token', body.token);
      if (!props.location.state) {
        // 用户直接点击登录按钮
        props.history.goBack();
      } else {
        // 用户通过其他地方跳转至登录页面
        props.history.replace(props.location.state.from.pathname)
      }
    } else {
      // 登录失败
      Toast.info(description, 2, null, false);
    }
  }
})(Login);
export default Login