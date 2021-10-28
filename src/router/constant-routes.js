import Error404 from '@/views/error/404'
import LoginPage from '@/views/login/Index'

export default [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '*',
    component: Error404,
  },
]
