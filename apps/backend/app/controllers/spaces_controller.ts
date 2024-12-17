import Branch from '#models/branch'
import Space from '#models/space'
import { createSpace } from '#validators/space'
import type { HttpContext } from '@adonisjs/core/http'

export default class SpaceController {
  async create({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createSpace)
    const user = auth.user

    const space = {
      owner_id: user?.id,
      name: data.name,
    }

    const created_space = await Space.create(space)

    const branch = {
      space_id: created_space.id,
      name: "root",
    }
    await Branch.create(branch)

    return response.accepted(true)
  }
}
