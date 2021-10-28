import routes from '@/router/routes'
import { resolvePath } from '@/router/util'

const recursiveHandleRoute = (route, parentPath) => {
  const path = resolvePath(parentPath, route.path)
  const result = { ...route, path }

  if (route.children) {
    result.children = route.children.map(subroute => recursiveHandleRoute(subroute, path))
    result.meta = {
      ...(route.meta || null),
      menuPath: path,
    }
  }

  return result
}

export default {
  basicRoutes: routes[0].children.map(route => recursiveHandleRoute(route, '/')),
  currentMenuPath: '/',
  userInfo: null,
}
