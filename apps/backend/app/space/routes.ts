import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const DeleteSpaceController = () => import('#space/usecases/DeleteSpace/controller')
const RenameSpaceController = () => import('#space/usecases/RenameSpace/controller')
const CreateSpaceController = () => import('#space/usecases/CreateSpace/controller')

export const registerSpaceRoutes = () => {
  router
    .group(() => {
      router.post('/create', [CreateSpaceController, 'handle']).as('space.create')
      router.post('/rename', [RenameSpaceController, 'handle']).as('space.rename')
      router.post('/delete', [DeleteSpaceController, 'handle']).as('space.delete')
    })
    .prefix('/space')
    .use(middleware.auth())
}
