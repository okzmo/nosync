import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Branch from '#branch/models/branch'
import { ownSpace } from '#abilities/main'
import { InvalidCellIdException } from '#cell/exceptions/invalid_cell.exception'
import { SaveTitleService } from './service.js'
import { saveTitleValidator } from './validator.js'

@inject()
export default class SaveTitleController {
  constructor(private saveTitle: SaveTitleService) {}

  async handle({ request, response, bouncer }: HttpContext) {
    const data = await request.validateUsing(saveTitleValidator)

    const branch = await Branch.findOrFail(data.branchId)
    if (await bouncer.denies(ownSpace, branch)) {
      return response.forbidden("You're not the owner of this branch")
    }

    try {
      await this.saveTitle.execute(data)
    } catch (error) {
      if (error instanceof InvalidCellIdException) {
        return response.status(+error.status).json({ message: error.message })
      }
    }

    return response.ok(true)
  }
}
