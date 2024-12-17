import User from '#models/user'
import { registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  async store_web({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const existing = await User.findBy('email', data.email)
    if (existing) {
      return response.forbidden({ cause: 'email', message: 'Email already in use.' })
    }

    const user = await User.create(data)

    await auth.use('web').login(user, true)

    return response.status(200)
  }
}
