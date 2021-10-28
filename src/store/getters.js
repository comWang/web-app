export default {
  pageList(state) {
    const { basicRoutes, currentMenuPath } = state
    const menu =
      basicRoutes.find(route => route.meta && route.meta.menuPath === currentMenuPath) || {}

    return menu.children || []
  },
}
