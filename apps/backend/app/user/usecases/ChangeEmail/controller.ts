import { type HttpContext } from '@adonisjs/core/http'
import { changeEmailValidator } from './validator.js'

export default class ChangeEmailController {
  async handle({ response, request, auth }: HttpContext) {
    const data = await request.validateUsing(changeEmailValidator)
    const user = await auth.authenticate()

    user.email = data.email
    user.isEmailVerified = false
    await user.save()

    return response.ok('An email has been sent to confirm your new email!')
  }
}
