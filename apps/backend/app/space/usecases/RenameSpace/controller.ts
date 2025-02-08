import type { HttpContext } from '@adonisjs/core/http'
import { renameSpaceValidator } from './validator.js'
import Space from '#space/models/space'
import { ownSpace } from '#abilities/main'

export default class RenameSpaceController {
  async handle({ request, response, bouncer }: HttpContext) {
    const data = await request.validateUsing(renameSpaceValidator)

    const space = await Space.findByOrFail('id', data.spaceId)
    if (await bouncer.denies(ownSpace, space)) {
      return response.forbidden('You do not own this space!')
    }

    space.name = data.name
    space.save()
  }
}
