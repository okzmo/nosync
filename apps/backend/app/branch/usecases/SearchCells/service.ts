import Cell from '#cell/models/cell'

export class SearchCellsService {
  async execute(branchId: number, query: string) {
    const queryToSearch = query.trim().split(' ').join(' or ')

    return await Cell.query()
      .where('branch_id', branchId)
      .whereRaw('search_vector @@ websearch_to_tsquery(?)', [queryToSearch])
      .preload('media')
  }
}
