import Cell from '#cell/models/cell'
import { cuid } from '@adonisjs/core/helpers'

export class CreateNoteService {
  async execute(data: { branchId: string; title?: string }) {
    const cell = new Cell()
    cell.id = cuid()
    cell.title = data.title || ''
    cell.branchId = data.branchId
    cell.type = 'note'
    cell.tags = 'notes'
    const newNote = cell.save()

    return newNote
  }
}
