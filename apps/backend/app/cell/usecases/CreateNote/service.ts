import Cell from '#cell/models/cell'
import { cuid } from '@adonisjs/core/helpers'

export class CreateNoteService {
  async execute(branchId: number) {
    const cell = new Cell()
    cell.id = cuid()
    cell.branchId = branchId
    cell.type = 'note'
    const newNote = cell.save()

    return newNote
  }
}
