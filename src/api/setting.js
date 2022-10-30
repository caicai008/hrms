import request from '@/utils/request'

/**
 * 获取所有角色信息
 * @param {*} params {page, pagesize}
 * @returns promise
 */
export const getRolesAPI = (params) => request({
  url: '/sys/role',
  method: 'GET',
  params: params
})

/**
 * 获取公司信息
 * @param {*} companyId
 * @returns
 */
export const getCompanyInfoAPI = (companyId) => request({
  url: `/company/${companyId}`
})

// 添加角色
export const addRoleAPI = (data) => request({
  url: '/sys/role',
  method: 'POST',
  data
})

/**
 * @description: 获取某一个角色列表
 * @param {*} id
 * @return {*}
 */
export function getRoleIdAPI(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/**
 * @description: 编辑角色
 * @param {*} data
 * @return {*}
 */
export function updateRoleAPI(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @description: 删除角色
 * @param {*} id 角色id
 * @return {*}
 */
export function deleteRoleAPI(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/**
 * 给角色分配权限
 * @param {*} data {id:角色id, permIds:[] 所有选中的节点的id组成的数组}
 * @returns
 */
export function assignPermAPI(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
