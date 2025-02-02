import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const ResetPasswordWithCurrentController = () =>
  import('#user/usecases/ResetPasswordWithCurrent/controller')
const VerifyEmailController = () => import('#user/usecases/VerifyEmail/controller')
const ResetPasswordController = () => import('#user/usecases/ResetPassword/controller')
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
      router.post('/verify/email/:token', [VerifyEmailController, 'handle']).as('verifyEmail')
      router.post('/check_token', [ResetPasswordController, 'checkToken']).as('checkToken')
      router.post('/password/reset', [ResetPasswordController, 'send']).as('passwordReset')
      router
        .post('/password/reset_with_current', [ResetPasswordWithCurrentController, 'handle'])
        .as('recovery.password_with_current')
      router
        .post('/recovery/password/:token', [ResetPasswordController, 'handle'])
        .as('recovery.password')
    })
    .prefix('/auth')
}
