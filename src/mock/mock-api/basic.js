// 请一律使用commonjs
const { createResponse } = require('../helper')

const userMap = {
  admin: 'admin',
}
const infoMap = {
  'as892038ce84f37': {
    userId: 1,
    nickname: '被眩晕的河神',
    avatar: null,
  },
}

module.exports.login = {
  url: /\/pub\/login/,
  method: 'post',
  response({ query }) {
    const isValid = (userMap[query.account] = query.password)

    if (isValid) {
      return createResponse(true, {
        token: 'as892038ce84f37',
        userId: 1,
      })
    } else {
      return createResponse(false, null, '账号或密码错误')
    }
  },
}

module.exports.queryUserInfo = {
  url: /\/pub\/userInfo/,
  method: 'post',
  response: createResponse(true, {
    ...infoMap['as892038ce84f37'],
  })
}
