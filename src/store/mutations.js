import storage from 'store'
import { ACCESS_TOKEN } from '@/config/types'

export default {
  setUserInfo(state, payload) {
    state.userInfo = payload
  },
  clearUserInfo(state) {
    state.userInfo = null
  },
  setToken(state, token) {
    storage.set(ACCESS_TOKEN, token)
  },
  clearToken() {
    storage.remove(ACCESS_TOKEN)
  },
  toggleCurrentMenu(state, menuPath) {
    state.currentMenuPath = menuPath
  },
}
