import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Branch from '#branch/models/branch'
import { ownSpace } from '#abilities/main'
import { InvalidCellIdException } from '#cell/exceptions/invalid_cell.exception'
import { SaveContentService } from './service.js'
import { saveContentValidator } from './validator.js'

@inject()
export default class SaveContentController {
  constructor(private saveContent: SaveContentService) {}

  async handle({ request, response, bouncer }: HttpContext) {
    const data = await request.validateUsing(saveContentValidator)

    const branch = await Branch.findOrFail(data.branchId)
    if (await bouncer.denies(ownSpace, branch)) {
      return response.forbidden("You're not the owner of this branch")
    }

    try {
      await this.saveContent.execute(data)
    } catch (error) {
      if (error instanceof InvalidCellIdException) {
        return response.status(+error.status).json({ message: error.message })
      }
    }

    return response.ok(true)
  }
}
