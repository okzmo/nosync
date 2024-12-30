import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const RegisterController = () => import('#user/usecases/Register/controller')
const LoginController = () => import('#user/usecases/Login/controller')
const CheckUserController = () => import('#user/usecases/CheckUser/controller')
const LogoutController = () => import('#user/usecases/Logout/controller')

export function registerUserRoutes() {
  router
    .group(() => {
      router.post('/register', [RegisterController, 'handle']).as('register')
      router.post('/login', [LoginController, 'handle']).as('login')
      router.get('/valid', [CheckUserController, 'handle']).as('check.user')
      router.post('/logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())
    })
    .prefix('/auth')
}
