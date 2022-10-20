import request from '@/utils/request'

export const departmentsListAPI = () => request({
  url: '/company/department'
})
