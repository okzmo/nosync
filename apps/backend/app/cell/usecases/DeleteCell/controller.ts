import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Branch from '#branch/models/branch'
import { ownSpace } from '#abilities/main'
import { DeleteCellService } from './service.js'
import { deleteCellValidator } from './validator.js'

@inject()
export default class DeleteCellController {
  constructor(private deleteCell: DeleteCellService) {}

  async handle({ request, response, bouncer }: HttpContext) {
    const data = await request.validateUsing(deleteCellValidator)

    const branch = await Branch.findOrFail(data.branchId)
    if (await bouncer.denies(ownSpace, branch)) {
      return response.forbidden("You're not the owner of this branch")
    }

    await this.deleteCell.execute(data.id)
  }
}
