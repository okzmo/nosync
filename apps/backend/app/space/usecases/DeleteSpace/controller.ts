import type { HttpContext } from '@adonisjs/core/http'
import { deleteSpaceValidator } from './validator.js'
import Space from '#space/models/space'
import { canDeleteSpace, ownSpace } from '#abilities/main'
import Branch from '#branch/models/branch'
import Cell from '#cell/models/cell'
import drive from '@adonisjs/drive/services/main'

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

    const branches = await Branch.query().where('space_id', space.id)

    for (const branch of branches) {
      const allCells = await Cell.query()
        .where('branch_id', branch.id)
        .where((query) => {
          query
            .whereLike('type', '%image%')
            .orWhereLike('type', '%video%')
            .orWhere('type', 'application/pdf')
        })
        .preload('media')

      for (const cell of allCells) {
        const originalKey = cell.media.originalUrl.split('/').at(-1)
        drive.use('s3').deleteAll(originalKey?.split('.')[0])
      }
    }

    space.delete()
  }
}
