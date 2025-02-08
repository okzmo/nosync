import { ownBranch } from '#abilities/main'
import Branch from '#branch/models/branch'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { SearchCellsService } from './service.js'
import { searchCellsValidator } from './validator.js'

@inject()
export default class SearchCellsController {
  constructor(private searchCells: SearchCellsService) {}

  async handle({ request, response, bouncer }: HttpContext) {
    const data = await request.validateUsing(searchCellsValidator)

    const branch = await Branch.findOrFail(data.branchId)
    if (await bouncer.denies(ownBranch, branch)) {
      return response.forbidden("You're not the owner of this branch")
    }

    const cells = await this.searchCells.execute(data)

    return cells
  }
}
