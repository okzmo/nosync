import type { HttpContext } from '@adonisjs/core/http'
import User from '#user/models/user'
import { loginValidator } from './validator.js'

export default class LoginController {
  async handle({ request, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    const spaces = await user.related('spaces').query().preload('branches')

    await auth.use('web').login(user, true)

    return { spaces }
  }
}
