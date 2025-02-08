import type { HttpContext } from '@adonisjs/core/http'
import { deleteBranchValidator } from './validator.js'
import Branch from '#branch/models/branch'
import { canDeleteBranch, ownBranch } from '#abilities/main'

export default class DeleteBranchController {
  async handle({ request, response, bouncer }: HttpContext) {
    const data = await request.validateUsing(deleteBranchValidator)

    const branch = await Branch.findByOrFail('id', data.branchId)
    if (await bouncer.denies(ownBranch, branch)) {
      return response.forbidden('You do not own this branch!')
    }

    if (await bouncer.denies(canDeleteBranch, branch)) {
      return response.forbidden('You cannot delete your first branch.')
    }

    branch.delete()
  }
}
