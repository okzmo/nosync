import { canCreateBranch } from '#abilities/main'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { CreateBranchService } from './service.js'
import Space from '#space/models/space'
import { createBranchValidator } from './validator.js'

@inject()
export default class CreateBranchController {
  constructor(private createBranch: CreateBranchService) {}

  async handle({ request, response, bouncer }: HttpContext) {
    const data = await request.validateUsing(createBranchValidator)

    const branch = await Space.findOrFail(data.spaceId)
    if (await bouncer.denies(canCreateBranch, branch)) {
      return response.forbidden("You're not the owner of this branch")
    }

    const newBranch = await this.createBranch.execute(data)

    return newBranch
  }
}
