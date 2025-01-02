import { ownSpace } from '#abilities/main'
import Branch from '#branch/models/branch'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { GetCellsService } from './service.js'
import { getCellsValidator } from './validator.js'

@inject()
export default class GetCellsController {
  constructor(private getCells: GetCellsService) {}

  async handle({ request, response, bouncer }: HttpContext) {
    console.log(request.params)
    const branchId = request.param('branchId')
    const validBranchId = await getCellsValidator.validate({ branchId: branchId })
    if (!validBranchId) {
      return response.forbidden('The given id is not a valid branch')
    }

    const branch = await Branch.findOrFail(validBranchId.branchId)
    if (await bouncer.denies(ownSpace, branch)) {
      return response.forbidden("You're not the owner of this branch")
    }

    const cells = await this.getCells.execute(validBranchId.branchId)

    return cells
  }
}
