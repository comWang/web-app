// 解析地址栏的query参数并以object中key-value形式返回
 const parseQueryParams = (searchString) => {
  if (!/^\?.*$/.test(searchString)) return {}
  return searchString
    .slice(1, searchString.length)
    .split('&')
    .reduce((params, item) => {
      const [key, value] = item.split('=')
      params[key] = ['false', 'true'].includes(value)
        ? Boolean(value)
        : value === undefined
        ? true
        : value
      return params
    }, {})
}

module.exports.createResponse = (success = true, data = null, message = 'ok') => ({
  mock: true,
  flag: success,
  data,
  message,
})

// 同mock-server的express req保持常用参数的一致性
module.exports.normalizeRequest = (fn) => {
  return function handleRequest(xhrRequest) {
    const URL = URL ? URL : window.URL
    const baseURL = /^https?:\/\//.test(location.origin)
      ? location.origin
      : 'http://localhost:8000'
    const urlObj = new URL(xhrRequest.url, baseURL)

    return fn({
      xhr: true,
      path: urlObj.pathname,
      query: parseQueryParams(urlObj.search),
      originalUrl: xhrRequest.url,
    })
  }
}
