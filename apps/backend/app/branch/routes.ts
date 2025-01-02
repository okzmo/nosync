import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const CreateBranchController = () => import('./usecases/CreateBranch/controller.js')
const GetCellsController = () => import('#branch/usecases/GetCells/controller')
const UploadMediaController = () => import('#branch/usecases/UploadMedia/controller')

export const registerBranchRoutes = () => {
  router
    .group(() => {
      router.get('/cells/:branchId', [GetCellsController, 'handle']).as('branch.getCells')
      router.post('/upload', [UploadMediaController, 'handle']).as('branch.uploadMedia')
      router.post('/create', [CreateBranchController, 'handle']).as('branch.create')
    })
    .prefix('/branch')
    .use(middleware.auth())
}
