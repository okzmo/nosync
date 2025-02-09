import type { HttpContext } from '@adonisjs/core/http'
import { deleteBranchValidator } from './validator.js'
import Branch from '#branch/models/branch'
import { canDeleteBranch, ownBranch } from '#abilities/main'
import Cell from '#cell/models/cell'
import drive from '@adonisjs/drive/services/main'

export default class DeleteBranchController {
  async handle({ request, response, bouncer }: HttpContext) {
    const data = await request.validateUsing(deleteBranchValidator)

    const branch = await Branch.findByOrFail('id', data.branchId)
    if (await bouncer.denies(ownBranch, branch)) {
      return response.forbidden('You do not own this branch!')
    }

    if (await bouncer.denies(canDeleteBranch, branch)) {
      return response.forbidden('You cannot delete your first branch.')
    }

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

    branch.delete()
  }
}
