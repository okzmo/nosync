import type { HttpContext } from '@adonisjs/core/http'
import { renameBranchValidator } from './validator.js'
import Branch from '#branch/models/branch'
import { ownBranch } from '#abilities/main'

export default class RenameBranchController {
  async handle({ request, response, bouncer }: HttpContext) {
    const data = await request.validateUsing(renameBranchValidator)

    const branch = await Branch.findByOrFail('id', data.branchId)
    if (await bouncer.denies(ownBranch, branch)) {
      return response.forbidden('You do not own this branch!')
    }

    branch.name = data.name
    branch.save()
  }
}
