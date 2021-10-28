import { BasicLayout, PageView, BlankLayout } from '@/layouts'

const layouts = {
  BasicLayout,
  PageView,
  BlankLayout,
  RouterView: {
    // eslint-disable-next-line
    render(h) {
      return <router-view />
    },
  },
}
const joinPath = (path, prepend) => {
  let fullpath = ''

  if (prepend) fullpath = prepend + path
  else fullpath = path

  return fullpath.replace(/\/\//g, '/')
}
// 从权限对象数组中获取权限名
const extractPermissions = arr => {
  if (Array.isArray(arr) && arr.length) {
    return arr.map(permission => permission.name.trim())
  }
  return []
}
// 获取当前页面及子页面的所有权限列表
const collectPermisssions = pageDefine => {
  if (!pageDefine) return []
  let permissions = []
  if (pageDefine.permissions) {
    permissions = permissions.concat(extractPermissions(pageDefine.permissions))
  }
  if (pageDefine.pages) {
    pageDefine.pages.map(subPage => {
      permissions = permissions.concat(collectPermisssions(subPage))
    })
    
  }
  return permissions
}
const generateRoutes = (nestedPermissions, namespace = '') => {
  if (!Array.isArray(nestedPermissions) || nestedPermissions.length < 1) return []
  const tree =
    namespace === ''
      ? [
          {
            path: '/',
            component: 'BasicLayout',
            pages: nestedPermissions,
          },
        ]
      : nestedPermissions

  return tree.map(item => {
    // 带有此标记的，子页面会作为该页面的tab面板展示。所有子页面的权限会提升在该页面。
    const isCachePage = item.remark === 'cache'
    let route
    if (isCachePage) {
     route = {
      path: joinPath(item.path, namespace),
      component: (item.component && layouts[item.component]) || (() => import(`@/views/${item.component}`)),
      children: [],
      meta: {
        title: item.description,
        permissions: collectPermisssions(item),
      },
     }
    } else {
      route = {
        path: joinPath(item.path, namespace),
        component:
          (item.component && layouts[item.component]) || (() => import(`@/views/${item.component}`)),
        children:
          item.pages && generateRoutes(item.pages, namespace ? namespace + item.path : item.path),
        redirect:
          item.pages && item.pages.length && joinPath(item.pages[0].path, namespace + item.path),
        meta: {
          title: item.description,
          permissions: extractPermissions(item.permissions),
        },
      }

      if (route.children && !route.children.length) {
        delete route.children
      }
    }
    
    return route
  })
}

export default generateRoutes
