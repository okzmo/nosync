import { InvalidCellIdException } from '#cell/exceptions/invalid_cell.exception'
import Cell from '#cell/models/cell'

export class SaveTitleService {
  async execute(data: { branchId: number; id: number; title: string }) {
    const cell = await Cell.query().where('id', data.id).where('branch_id', data.branchId).first()

    if (!cell) {
      throw new InvalidCellIdException()
    }

    cell.title = data.title
    cell.save()
  }
}
