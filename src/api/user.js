/* eslint-disable no-unused-vars */
/*
 * @Author: 月魂
 * @Date: 2022-08-31 12:00:00
 * @LastEditTime: 2022-08-31 16:54:57
 * @LastEditors: 月魂
 * @Description: user
 * @FilePath: \file-manage-admin\src\api\user.js
 */
import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/api/v1/auth/account',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/v1/employee/personal',
    method: 'get'
  })
}

export function editPassword() {
  return request({
    url: '/api/edit',
    method: 'post'
  })
}

// 分页查询员工信息接口
export function getEmployeeList(params) {
  return request({
    url: `/api/v1/employee/list?${qs.stringify(params)}`,
    method: 'get'
  })
}

// 获取角色信息接口
export function getRoleList() {
  return request({
    url: '/api/v1/role/list',
    method: 'get'
  })
}

// 重置员工密码接口
export function resetPwd(id) {
  return request({
    url: `/api/v1/employee/${id}/reset/password`,
    method: 'put'
  })
}

// 删除员工信息接口
export function removeEmployee(id) {
  return request({
    url: `/api/v1/employee/${id}`,
    method: 'delete'
  })
}

// 禁用该员工信息接口
export function disableEmployee(id) {
  return request({
    url: `/api/v1/employee/${id}/disabled`,
    method: 'put'
  })
}

// 启用该员工信息接口
export function enableEmployee(id) {
  return request({
    url: `/api/v1/employee/${id}/enable`,
    method: 'put'
  })
}

// 新增员工信息接口
export function addEmployee(data) {
  return request({
    url: '/api/v1/employee',
    method: 'post',
    data
  })
}

// 修改员工信息接口
export function updateEmployee(data) {
  return request({
    url: `/api/v1/employee/${data.id}`,
    method: 'put',
    data
  })
}

