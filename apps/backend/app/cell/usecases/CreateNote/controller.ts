import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Branch from '#branch/models/branch'
import { ownBranch } from '#abilities/main'
import { CreateNoteService } from './service.js'
import { createNoteValidator } from './validator.js'

@inject()
export default class CreateNoteController {
  constructor(private createNote: CreateNoteService) {}

  async handle({ request, response, bouncer }: HttpContext) {
    const data = await request.validateUsing(createNoteValidator)

    const branch = await Branch.findOrFail(data.branchId)
    if (await bouncer.denies(ownBranch, branch)) {
      return response.forbidden("You're not the owner of this branch")
    }

    const newNote = await this.createNote.execute(data)

    return newNote
  }
}
