import type { HttpContext } from '@adonisjs/core/http'

export default class CheckUserController {
  async handle({ response, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const spaces = await user
      .related('spaces')
      .query()
      .orderBy('createdAt', 'asc')
      .preload('branches', (branchesQuery) => {
        branchesQuery.orderBy('created_at', 'asc')
      })

    return response.ok({ user, spaces })
  }
}
