/*
 * @Author: 月魂
 * @Date: 2022-08-31 12:00:01
 * @LastEditTime: 2022-08-31 15:16:59
 * @LastEditors: 月魂
 * @Description: auth
 * @FilePath: \file-manage-admin\src\utils\auth.js
 */
import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
