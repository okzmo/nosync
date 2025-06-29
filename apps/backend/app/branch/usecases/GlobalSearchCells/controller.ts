import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { GlobalSearchCellsService } from './service.js'
import { globalSearchCellsValidator } from './validator.js'
import Space from '#space/models/space'

@inject()
export default class GlobalSearchCellsController {
  constructor(private searchCells: GlobalSearchCellsService) { }

  async handle({ request, auth }: HttpContext) {
    console.log('GlobalSearchCellsController called')
    const data = await request.validateUsing(globalSearchCellsValidator)
    const user = await auth.authenticate()

    const spaces = await Space.query()
      .where('owner_id', user.id)
      .preload('branches', (branchesQuery) => branchesQuery.select('id'))
    const branches = spaces.flatMap((space) => space.branches)

    const cells = await this.searchCells.execute({ branches, query: data.query })

    return cells
  }
}
