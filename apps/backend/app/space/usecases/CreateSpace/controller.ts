import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { CreateSpaceService } from './service.js'
import { createSpaceValidator } from './validator.js'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class CreateSpaceController {
  constructor(private createSpace: CreateSpaceService) { }

  async handle({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createSpaceValidator)
    const user = await auth.authenticate()

    if (!user) {
      return response.forbidden('You are not logged in')
    }

    const spaces = await db.from('spaces').where('owner_id', user.id).count('* as total')
    const space = await this.createSpace.execute(user.id, data.name, spaces[0].total === '0')

    return space
  }
}
