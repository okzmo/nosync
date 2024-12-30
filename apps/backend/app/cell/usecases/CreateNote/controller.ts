import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Branch from '#branch/models/branch'
import { ownSpace } from '#abilities/main'
import { CreateNoteService } from './service.js'
import { createNoteValidator } from './validator.js'

@inject()
export default class CreateNoteController {
  constructor(private createNote: CreateNoteService) {}

  async handle({ request, response, bouncer }: HttpContext) {
    const data = await request.validateUsing(createNoteValidator)

    const branch = await Branch.findOrFail(data.branchId)
    if (await bouncer.denies(ownSpace, branch)) {
      return response.forbidden("You're not the owner of this branch")
    }

    const cell = await this.createNote.execute(data.branchId)

    return cell
  }
}
