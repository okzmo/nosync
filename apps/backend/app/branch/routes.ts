import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const GetCellsController = () => import('#branch/usecases/GetCells/controller')
const UploadMediaController = () => import('#branch/usecases/UploadMedia/controller')

export const registerBranchRoutes = () => {
  router
    .group(() => {
      router.get('/:branchId', [GetCellsController, 'handle']).as('branch.getCells')
      router.post('/upload', [UploadMediaController, 'handle']).as('branch.uploadMedia')
    })
    .prefix('/branch')
    .use(middleware.auth())
}
