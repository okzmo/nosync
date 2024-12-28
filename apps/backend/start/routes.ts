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
const CellsController = () => import('#controllers/cells_controller')
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
        router.post('/upload', [SpaceController, 'upload']).as('space.upload')
      })
      .prefix('/space')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/:branchId', [CellsController, 'allCells']).as('branch.allCells')
      })
      .prefix('/branch')
      .use(middleware.auth())

    router
      .group(() => {
        router.post('/save_title', [CellsController, 'saveTitle']).as('branch.save.title')
        router.post('/save_content', [CellsController, 'saveContent']).as('branch.save.content')
        router.post('/create_note', [CellsController, 'createNote']).as('branch.create.note')
        router.delete('/delete_cell', [CellsController, 'deleteCell']).as('branch.delete.cell')
      })
      .prefix('/cell')
      .use(middleware.auth())
  })
  .prefix('/v1')
