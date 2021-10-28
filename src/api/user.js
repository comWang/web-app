import request from '@/utils/request'

export const login = (account, password) =>
  request({
    method: 'post',
    url: '/pub/login',
    params: { account, password },
  })

export const queryUserInfo = userId =>
  request({
    method: 'post',
    url: '/pub/userInfo',
    params: { userId },
  })
