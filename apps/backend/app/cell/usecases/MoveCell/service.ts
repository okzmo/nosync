import { MoveException } from '#cell/exceptions/move.exception'
import Cell from '#cell/models/cell'

export class MoveCellService {
  async execute(id: string, branchId: string) {
    const cellToMove = await Cell.query().where('id', id).first()

    if (!cellToMove) throw new MoveException()

    cellToMove.branchId = branchId
    cellToMove.save()
  }
}
