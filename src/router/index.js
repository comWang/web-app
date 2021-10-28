import Router from 'vue-router'
import constantRoutes from './constant-routes'
import routes from './routes'

// hack router push callback
const originalPush = Router.prototype.push

Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)

  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  mode: 'hash',
  routes: routes.concat(constantRoutes),
})
