import type { HttpContext } from '@adonisjs/core/http'
import { deleteSpaceValidator } from './validator.js'
import Space from '#space/models/space'
import { canDeleteSpace, ownSpace } from '#abilities/main'

export default class DeleteSpaceController {
  async handle({ request, response, bouncer }: HttpContext) {
    const data = await request.validateUsing(deleteSpaceValidator)

    const space = await Space.findByOrFail('id', data.spaceId)
    if (await bouncer.denies(ownSpace, space)) {
      return response.forbidden('You do not own this space!')
    }

    if (await bouncer.denies(canDeleteSpace, space)) {
      return response.forbidden('You cannot delete your first space.')
    }

    space.delete()
  }
}
