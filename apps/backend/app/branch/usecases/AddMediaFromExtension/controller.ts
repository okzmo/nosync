import { ownBranch } from '#abilities/main'
import Branch from '#branch/models/branch'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { AddMediaFromExtensionService } from './service.js'
import { addMediaFromExtensionValidator } from './validators.js'

@inject()
export default class AddMediaFromExtensionController {
  constructor(private addMediaFromExtension: AddMediaFromExtensionService) {}

  async handle({ bouncer, request, response, auth }: HttpContext) {
    const data = await request.validateUsing(addMediaFromExtensionValidator)

    const branch = await Branch.findByOrFail('id', data.branchId)
    if (await bouncer.denies(ownBranch, branch)) {
      return response.forbidden('You cannot upload a file to this branch')
    }

    const user = await auth.authenticate()

    await this.addMediaFromExtension.execute(data, user.id)
  }
}
