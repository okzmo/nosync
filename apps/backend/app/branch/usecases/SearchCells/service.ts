import { InferInput } from '@vinejs/vine/types'
import { searchCellsValidator } from './validator.js'
import client from '#meilisearch/client'

export class SearchCellsService {
  async execute(data: InferInput<typeof searchCellsValidator>) {
    const { branchId, query } = data

    const searchQuery = query?.trim() || ''

    const cells = await client.index('cells').search(searchQuery, {
      filter: `branchId = ${branchId}`,
      limit: 30,
      sort: ['createdAt:asc'],
    })

    return cells.hits
  }
}
