import Cell from '#cell/models/cell'

export class CreateNoteService {
  async execute(branchId: number) {
    const cell = new Cell()
    cell.branch_id = branchId
    cell.type = 'note'
    const newNote = cell.save()

    return newNote
  }
}
