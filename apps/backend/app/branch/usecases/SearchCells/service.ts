import { InferInput } from '@vinejs/vine/types'
import { searchCellsValidator } from './validator.js'
import Cell from '#cell/models/cell'
import client from '#services/meili_client'

export class SearchCellsService {
  async execute(data: InferInput<typeof searchCellsValidator>) {
    const { branchId, query } = data

    const searchQuery = query?.trim() || ''

    const meiliCells = await client.index('cells').search(searchQuery, {
      filter: `branchId = ${branchId}`,
      attributesToRetrieve: ['id', 'createdAt'],
      limit: 30,
      sort: ['createdAt:asc'],
    })

    const cellIds = meiliCells.hits.map((hit) => hit.id)
    const cells: Cell[] = await Cell.query()
      .whereIn('id', cellIds)
      .preload('media')
      .orderBy('createdAt', 'asc')

    return cells
  }
}
