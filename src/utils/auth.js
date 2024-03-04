/**
 * 封装对token操作的相应的方法，包括获取token，设置token，删除token，判断token是否存在
 */

const TOKEN_NAME = 'Renting_token';

// 获取token
function getToken() {
  return localStorage.getItem(TOKEN_NAME)
}

// 设置token
function setToken(value) {
  localStorage.setItem(TOKEN_NAME, value)
}

// 删除token
function removeToken() {
  localStorage.removeItem(TOKEN_NAME)
}

// 判断是否有权限（是否登录）
const isAuth = () => !!getToken()


export { getToken, setToken, removeToken, isAuth }