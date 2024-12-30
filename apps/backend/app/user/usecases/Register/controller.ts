import type { HttpContext } from '@adonisjs/core/http'
import User from '#user/models/user'
import { registerValidator } from './validator.js'

export default class RegisterController {
  async handle({ response, request, auth }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const existing = await User.findBy('email', data.email)
    if (existing) {
      return response.forbidden({ cause: 'email', message: 'Email already in use.' })
    }

    const user = await User.create(data)

    await auth.use('web').login(user, true)

    return response.ok({})
  }
}
