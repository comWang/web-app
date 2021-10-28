import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './router'
import storage from 'store'
import { ACCESS_TOKEN } from './config/types'

const setDocumentTitle = function(title) {
  document.title = title
  const ua = navigator.userAgent
  // eslint-disable-next-line
  const regex = /\bMicroMessenger\/([\d\.]+)/

  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement('iframe')

    i.src = '/favicon.ico'
    i.style.display = 'none'
    i.onload = function() {
      setTimeout(function() {
        i.remove()
      }, 9)
    }
    document.body.appendChild(i)
  }
}
// 配置顶部加载进度条
NProgress.configure({ showSpinner: false })
const loginRoutePath = '/login'
// 白名单
const whiteList = [loginRoutePath]

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.meta && to.meta.title) {
    setDocumentTitle(to.meta.title)
  }

  if (storage.get(ACCESS_TOKEN)) {
    next()
  } else if (whiteList.includes(to.path)) {
    next()
  } else {
    next({ path: loginRoutePath })
    NProgress.done()
  }
})
router.afterEach(() => {
  NProgress.done()
})
