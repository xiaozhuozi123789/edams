/*
 * @Author: 月魂
 * @Date: 2022-08-31 12:00:01
 * @LastEditTime: 2022-08-31 13:27:37
 * @LastEditors: 月魂
 * @Description: validate
 * @FilePath: \file-manage-admin\src\utils\validate.js
 */
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
