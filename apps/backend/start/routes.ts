/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const RegisterController = () => import('#controllers/auth/register_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
const SpaceController = () => import('#controllers/spaces_controller')

router
  .group(() => {
    router
      .group(() => {
        router.post('/register', [RegisterController, 'store_web']).as('register.store.web')
        router.post('/login', [LoginController, 'store_web']).as('login.store.web')
        router.get('/valid', [LoginController, 'check']).as('login.check.web')
        router
          .post('/logout', [LogoutController, 'handle'])
          .as('logout.store.web')
          .use(middleware.auth())
      })
      .prefix('/auth')

    router
      .group(() => {
        router.post('/create', [SpaceController, 'create']).as('space.create')
      })
      .prefix('/space')
      .use(middleware.auth())
  })
  .prefix('/v1')
