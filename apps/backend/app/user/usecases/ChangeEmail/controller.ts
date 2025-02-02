import { type HttpContext } from '@adonisjs/core/http'
import { changeEmailValidator } from './validator.js'
import Token from '#user/models/token'
import env from '#start/env'
import mail from '@adonisjs/mail/services/main'
import VerifyENotification from '#mails/verify_e_notification'

export default class ChangeEmailController {
  async handle({ response, request, auth }: HttpContext) {
    const data = await request.validateUsing(changeEmailValidator)
    const user = await auth.authenticate()

    user.email = data.email
    user.isEmailVerified = false
    await user.save()

    const token = await Token.generateToken({
      user,
      relation: 'verifyEmailTokens',
      type: 'VERIFY_EMAIL',
    })
    const resetLink = `${env.get('FRONTEND_URL')}/verify/email/${token}`

    if (user) {
      await mail.sendLater(new VerifyENotification(user, resetLink))
    }

    return response.ok('An email has been sent to confirm your new email!')
  }
}
