import { type HttpContext } from '@adonisjs/core/http'
import { resetPasswordValidator } from './validator.js'
import hash from '@adonisjs/core/services/hash'

export default class ResetPasswordWithCurrentController {
  async handle({ response, request, auth }: HttpContext) {
    const data = await request.validateUsing(resetPasswordValidator)
    const user = await auth.authenticate()

    const validPassword = await hash.verify(user.password, data.currentPassword)
    if (!validPassword) {
      return response.forbidden("Doesn't match your current password")
    }

    if (data.newPassword !== data.confirm) {
      return response.forbidden("Passwords don't match")
    }

    await user.merge({ password: data.newPassword }).save()

    return response.ok('Your new password has been saved!')
  }
}
