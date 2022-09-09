/*
 * @Author: 月魂
 * @Date: 2022-08-31 12:00:01
 * @LastEditTime: 2022-08-31 15:32:38
 * @LastEditors: 月魂
 * @Description: get
 * @FilePath: \file-manage-admin\src\utils\get-page-title.js
 */
import defaultSettings from '@/settings'

const title = defaultSettings.title || 'File Manage System'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
