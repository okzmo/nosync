import { type HttpContext } from '@adonisjs/core/http'
import { verifyEmailSendValidator } from './validator.js'
import User from '#user/models/user'
import mail from '@adonisjs/mail/services/main'
import PasswordResetNotification from '#mails/password_reset_notification'
import Token from '#user/models/token'

export default class VerifyEmailController {
  async send({ response, request }: HttpContext) {
    const data = await request.validateUsing(verifyEmailSendValidator)

    const user = await User.findBy('email', data.email)
    const token = await Token.generateToken({
      user,
      relation: 'verifyEmailTokens',
      type: 'VERIFY_EMAIL',
    })
    const resetLink = `http://localhost:5173/verify/email/${token}`

    if (user) {
      await mail.sendLater(new PasswordResetNotification(user, resetLink))
    }

    return response.ok('An email has been sent to the provided email.')
  }

  async handle({ response, request, auth }: HttpContext) {
    const token = request.param('token')
    const user = await Token.getTokenUser(token, 'VERIFY_EMAIL')

    if (!user) {
      return response.forbidden('Token is invalid')
    }

    await user.merge({ isEmailVerified: true }).save()
    await Token.expireTokens(user, 'verifyEmailTokens')
    await auth.use('web').login(user, true)

    return response.ok("Your email has been verified, you'll now be redirected to your account!")
  }
}
