import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const AddMediaFromExtensionController = () =>
  import('#branch/usecases/AddMediaFromExtension/controller')
const SearchCellsController = () => import('#branch/usecases/SearchCells/controller')
const CreateBranchController = () => import('#branch/usecases/CreateBranch/controller')
const GetCellsController = () => import('#branch/usecases/GetCells/controller')
const UploadMediaController = () => import('#branch/usecases/UploadMedia/controller')

export const registerBranchRoutes = () => {
  router
    .group(() => {
      router.get('/cells/:branchId', [GetCellsController, 'handle']).as('branch.getCells')
      router.post('/search_cells', [SearchCellsController, 'handle']).as('branch.searchCells')
      router.post('/upload', [UploadMediaController, 'handle']).as('branch.uploadMedia')
      router.post('/create', [CreateBranchController, 'handle']).as('branch.create')
      router
        .post('/extension/add', [AddMediaFromExtensionController, 'handle'])
        .as('branch.addMediaFromExtension')
    })
    .prefix('/branch')
    .use(middleware.auth())
}
