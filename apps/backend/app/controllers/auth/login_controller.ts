import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async store_web({ response, request, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    await auth.use('web').login(user, true)

    return response.status(200)
  }

  async check({ response, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const spaces = await user.related("spaces").query().preload("branches", (branchQuery) => {
      branchQuery.preload("cells")
    })

    return response.accepted({ user, spaces })
  }
}
