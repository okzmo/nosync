import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const CreateSpaceController = () => import('#space/usecases/CreateSpace/controller')

export const registerSpaceRoutes = () => {
  router
    .group(() => {
      router.post('/create', [CreateSpaceController, 'handle']).as('space.create')
    })
    .prefix('/space')
    .use(middleware.auth())
}
