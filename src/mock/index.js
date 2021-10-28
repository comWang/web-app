if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_MODE === 'preview') {
  window.originXMLHttpRequest = XMLHttpRequest
  const Mock = require('mockjs')
  const { normalizeRequest } = require('./helper')

  Mock.setup({
    timeout: '200-1000',
  })
  const originMockMethod = Mock.mock

  Mock.mock = (rurl, ...rest) => {
    const url = rurl.toString()
    // eslint-disable-next-line
    console.log(`Mock path: ${url.slice(1, url.length - 1).replace(/\\/g, '')}`)

    return originMockMethod.call(Mock, rurl, ...rest)
  }
  // eslint-disable-next-line
  console.warn(
    'Mock(frontend)：established!Exception may be in frameworks relying on "XMLHttpRequest".'
  )
  const apiModules = require.context('./mock-api', true, /\.js$/)

  apiModules.keys().forEach(moduleKey => {
    const currentModule = apiModules(moduleKey)

    Object.keys(currentModule).forEach(key => {
      const api = currentModule[key]

      Mock.mock(
        api.url,
        api.method,
        typeof api.response === 'function' ? normalizeRequest(api.response) : () => api.response
      )
    })
  })
}
