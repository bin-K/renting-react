/**
 * 封装对城市信息在本地存储的操作
 */

const TOKEN_NAME = 'localCity'
//获取当前定位城市
const getCity = () => JSON.parse(localStorage.getItem(TOKEN_NAME)) || {}
//设置当前定位城市
const setCity = value => localStorage.setItem(TOKEN_NAME, value)

export { getCity, setCity }
