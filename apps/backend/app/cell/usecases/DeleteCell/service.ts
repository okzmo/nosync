import Cell from '#cell/models/cell'

export class DeleteCellService {
  async execute(id: number) {
    await Cell.query().where('id', id).del()
  }
}
