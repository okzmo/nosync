import { ownSpace } from '#abilities/main'
import Branch from '#models/branch'
import Cell from '#models/cell'
import { retrieveCellsFromBranch, saveContent, saveTitle } from '#validators/cell'
import type { HttpContext } from '@adonisjs/core/http'

export default class CellsController {
  async allCells({ request, response }: HttpContext) {
    const branchId = request.param('branchId')
    const validBranchId = await retrieveCellsFromBranch.validate({ branchId: branchId })
    if (!validBranchId) {
      return response.forbidden('You cannot get the cells of this branch')
    }
    const cells = await Cell.query()
      .where('branch_id', Number.parseInt(branchId))
      .orderBy('created_at', 'asc')
      .preload('media')

    return cells
  }

  async saveTitle({ request, response, bouncer }: HttpContext) {
    const data = await request.validateUsing(saveTitle)

    const branch = await Branch.findByOrFail('id', data.branchId)
    const isOwner = await bouncer.allows(ownSpace, branch)
    if (!isOwner) {
      return response.forbidden('You cannot edit this cell')
    }

    const cell = await Cell.query().where('id', data.id).where('branch_id', data.branchId).first()
    if (!cell) {
      return response.forbidden('The given id is not a valid cell')
    }

    cell.title = data.title
    cell.save()

    return response.ok(true)
  }

  async saveContent({ request, response }: HttpContext) {
    const data = await request.validateUsing(saveContent)
    const cell = await Cell.findBy('id', data.id)

    if (!cell) {
      return response.forbidden('The given id is not a valid cell')
    }

    cell.content = data.content
    cell.save()

    return response.ok(true)
  }
}
