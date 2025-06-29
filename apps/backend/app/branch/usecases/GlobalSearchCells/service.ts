import Cell from '#cell/models/cell'
import client from '#services/meili_client'
import Branch from '#branch/models/branch'

export class GlobalSearchCellsService {
  async execute({ branches, query }: { branches: Branch[]; query: string }) {
    const searchQuery = query.trim()

    const meiliCells = await client.index('cells').search(searchQuery, {
      filter: `branchId IN [${branches.map((branch) => branch.id).join(',')}]`,
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
