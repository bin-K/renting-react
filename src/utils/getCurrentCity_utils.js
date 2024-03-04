/**
 * 发送请求，获取到当前所在城市的信息
 */
import axios from "axios"

export const getCurrentCity = () => {
  // 判断本地是否存在城市信息，如果存在可以直接使用本地的城市信息
  const localCity = JSON.parse(localStorage.getItem('localCity'))
  // 本地城市信息不存在
  if (!localCity) {
    // 因为发送请求是异步操作，所以通过Promise来处理
    return new Promise((resolve, reject) => {
      //获取定位
      const myCity = new window.BMapGL.LocalCity();
      
      myCity.get(async res => {
        try {
          const result = await axios.get(`http://localhost:8009/area/info?name=${res.name}`)
          localStorage.setItem('localCity', JSON.stringify(result.data.body))
          resolve(result.data.body)
        } catch (error) {
          reject(error)
        }
      });
    })
  }
  return Promise.resolve(localCity)
}