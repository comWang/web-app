import { login, queryUserInfo } from '@/api/user'

export default {
  async login({ commit }, payload) {
    const [err, res] = await login(payload.account, payload.password)

    if (err) {
      throw err
    } else {
      commit('setToken', res.data.token)
    }
  },
  logout({ commit }) {
    commit('clearToken')
    commit('clearUserInfo')
    setTimeout(() => {
      location.reload()
    }, 400)
  },
  async queryUserInfo({ commit }) {
    const [err, res] = await queryUserInfo()

    if (!err) {
      commit('setUserInfo', res.data)
    }
  },
}
