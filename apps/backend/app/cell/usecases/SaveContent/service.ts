import { InvalidCellIdException } from '#cell/exceptions/invalid_cell.exception'
import Cell from '#cell/models/cell'

export class SaveContentService {
  async execute(data: { branchId: string; id: string; content?: any; searchContent?: string }) {
    const cell = await Cell.query().where('id', data.id).where('branch_id', data.branchId).first()

    if (!cell) {
      throw new InvalidCellIdException('The given id is not a valid cell')
    }

    cell.content = data.content
    cell.searchContent = data.searchContent
    cell.save()
  }
}
