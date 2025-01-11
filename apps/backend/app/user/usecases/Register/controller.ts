import type { HttpContext } from '@adonisjs/core/http'
import User from '#user/models/user'
import { registerValidator } from './validator.js'
import Token from '#user/models/token'
import mail from '@adonisjs/mail/services/main'
import VerifyENotification from '#mails/verify_e_notification'

export default class RegisterController {
  async handle({ response, request }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const existing = await User.findBy('email', data.email)
    if (existing) {
      return response.forbidden({ cause: 'email', message: 'Email already in use.' })
    }

    const user = await User.create(data)
    const token = await Token.generateToken({
      user,
      relation: 'verifyEmailTokens',
      type: 'VERIFY_EMAIL',
    })
    const resetLink = `http://localhost:5173/verify/email/${token}`
    await mail.sendLater(new VerifyENotification(user, resetLink))

    return response.ok('An email has been sent to your email')
  }
}
