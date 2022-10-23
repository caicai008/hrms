import request from '@/utils/request'

/**
 * @description: 获取员工列表
 * @param {*} params {page:当前页,size：每页条数}
 * @return {*}
 */
export function getEmployeeListAPI(params) {
  return request({
    url: '/sys/user',
    methods: 'get',
    params
  })
}

/**
 * @description: 添加员工
 * @param {*} data
 * @return {*}
 */
export function addEmployeeAPI(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

/**
 * @description: 删除员工
 * @param {*} id 员工id
 * @return {*}
 */
export function delEmployeeAPI(id) {
  return request({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}
