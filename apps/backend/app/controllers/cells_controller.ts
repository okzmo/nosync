import Cell from '#models/cell'
import type { HttpContext } from '@adonisjs/core/http'

export default class CellsController {
  async index({ request }: HttpContext) {
    const branchId = request.param('branchId')
    const cells = await Cell.query().where('branch_id', Number.parseInt(branchId)).preload('media')

    return cells
  }
}
