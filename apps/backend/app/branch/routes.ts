import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const GlobalSearchCellsController = () => import('#branch/usecases/GlobalSearchCells/controller')
const RenameBranchController = () => import('#branch/usecases/RenameBranch/controller')
const DeleteBranchController = () => import('#branch/usecases/DeleteBranch/controller')
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
      router
        .post('/global_search_cells', [GlobalSearchCellsController, 'handle'])
        .as('branch.globalSearchCells')
      router.post('/upload', [UploadMediaController, 'handle']).as('branch.uploadMedia')
      router.post('/create', [CreateBranchController, 'handle']).as('branch.create')
      router.post('/rename', [RenameBranchController, 'handle']).as('branch.rename')
      router.post('/delete', [DeleteBranchController, 'handle']).as('branch.delete')
      router
        .post('/extension/add', [AddMediaFromExtensionController, 'handle'])
        .as('branch.addMediaFromExtension')
    })
    .prefix('/branch')
    .use(middleware.auth())
}
