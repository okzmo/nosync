import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Branch from '#branch/models/branch'
import { ownBranch } from '#abilities/main'
import { MoveCellService } from './service.js'
import { moveCellValidator } from './validator.js'

@inject()
export default class MoveCellController {
  constructor(private moveCell: MoveCellService) {}

  async handle({ request, response, bouncer }: HttpContext) {
    const data = await request.validateUsing(moveCellValidator)

    const branch = await Branch.findOrFail(data.branchId)
    if (await bouncer.denies(ownBranch, branch)) {
      return response.forbidden("You're not the owner of this branch")
    }

    await this.moveCell.execute(data.id, data.branchId)
  }
}
