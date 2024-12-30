/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { registerUserRoutes } from '#user/routes'
import { registerCellRoutes } from '#cell/routes'
import { registerBranchRoutes } from '#branch/routes'
import { registerSpaceRoutes } from '#space/routes'

router
  .group(() => {
    registerUserRoutes(), registerCellRoutes(), registerBranchRoutes(), registerSpaceRoutes()
  })
  .prefix('/v1')
