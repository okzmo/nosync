import Cell from '#cell/models/cell'

export class GetCellsService {
  async execute(branchId: number) {
    return await Cell.query()
      .where('branch_id', branchId)
      .orderBy('created_at', 'asc')
      .preload('media')
  }
}
