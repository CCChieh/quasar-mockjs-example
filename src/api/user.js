import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getInfo () {
  return request({
    url: '/sys/users/current',
    method: 'get'
  })
}

export function logout () {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
