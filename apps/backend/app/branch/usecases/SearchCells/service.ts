import Cell from '#cell/models/cell'
import { InferInput } from '@vinejs/vine/types'
import { searchCellsValidator } from './validator.js'

export class SearchCellsService {
  async execute(data: InferInput<typeof searchCellsValidator>) {
    const { branchId, query } = data
    const baseQuery = Cell.query()
      .where('branch_id', branchId)
      .preload('media')
      .orderBy('created_at', 'asc')

    if (!query) {
      return await baseQuery
    }

    const searchQuery = query
      .trim()
      .split(' ')
      .map((term) => `${term}:*`)
      .join(' or ')
    return await baseQuery.whereRaw('search_vector @@ to_tsquery(?)', [searchQuery])
  }
}
