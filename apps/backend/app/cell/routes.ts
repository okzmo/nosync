import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const MoveCellController = () => import('#cell/usecases/MoveCell/controller')
const DeleteCellController = () => import('#cell/usecases/DeleteCell/controller')
const SaveTitleController = () => import('#cell/usecases/SaveTitle/controller')
const SaveContentController = () => import('#cell/usecases/SaveContent/controller')
const CreateNoteController = () => import('#cell/usecases/CreateNote/controller')

export const registerCellRoutes = () => {
  router
    .group(() => {
      router.post('/save_title', [SaveTitleController, 'handle']).as('branch.save.title')
      router.post('/save_content', [SaveContentController, 'handle']).as('branch.save.content')
      router.post('/create_note', [CreateNoteController, 'handle']).as('branch.create.note')
      router.delete('/delete_cell', [DeleteCellController, 'handle']).as('branch.delete.cell')
      router.post('/move_cell', [MoveCellController, 'handle']).as('branch.move.cell')
    })
    .prefix('/cell')
    .use(middleware.auth())
}
