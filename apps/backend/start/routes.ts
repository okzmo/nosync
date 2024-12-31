/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'
import { registerUserRoutes } from '#user/routes'
import { registerCellRoutes } from '#cell/routes'
import { registerBranchRoutes } from '#branch/routes'
import { registerSpaceRoutes } from '#space/routes'
import { middleware } from './kernel.js'

router
  .group(() => {
    registerUserRoutes(), registerCellRoutes(), registerBranchRoutes(), registerSpaceRoutes()
  })
  .prefix('/v1')

transmit.registerRoutes((route) => {
  if (route.getPattern() === '__transmit/events') {
    route.middleware(middleware.auth())
    return
  }
})
