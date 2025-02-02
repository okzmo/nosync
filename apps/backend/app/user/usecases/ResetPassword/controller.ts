import { type HttpContext } from '@adonisjs/core/http'
import { resetPasswordSendValidator, resetPasswordValidator, checkToken } from './validator.js'
import User from '#user/models/user'
import mail from '@adonisjs/mail/services/main'
import PasswordResetNotification from '#mails/password_reset_notification'
import Token from '#user/models/token'
import env from '#start/env'

export default class ResetPasswordController {
  async send({ response, request }: HttpContext) {
    const data = await request.validateUsing(resetPasswordSendValidator)

    const user = await User.findBy('email', data.email)
    const token = await Token.generateToken({
      user,
      relation: 'passwordResetTokens',
      type: 'PASSWORD_RESET',
    })
    const resetLink = `${env.get('FRONTEND_URL')}/recovery/password/${token}`

    if (user) {
      await mail.sendLater(new PasswordResetNotification(user, resetLink))
    }

    return response.ok('An email has been sent to the provided email.')
  }

  async checkToken({ response, request }: HttpContext) {
    const data = await request.validateUsing(checkToken)
    const isValid = await Token.verify(data.token, 'PASSWORD_RESET')

    if (!isValid) {
      return response.forbidden('Token is invalid')
    }

    return response.status(200)
  }

  async handle({ response, request, auth }: HttpContext) {
    const token = request.param('token')
    const user = await Token.getTokenUser(token, 'PASSWORD_RESET')

    if (!user) {
      return response.forbidden('Token is invalid')
    }

    const data = await request.validateUsing(resetPasswordValidator)
    await user.merge({ password: data.newPassword }).save()
    await Token.expireTokens(user, 'passwordResetTokens')

    await auth.use('web').login(user, true)

    return response.ok(
      "Your new password has been saved, you'll now be redirected to your account!"
    )
  }
}
