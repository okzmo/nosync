import type { HttpContext } from '@adonisjs/core/http'
import User from '#user/models/user'
import { registerValidator } from './validator.js'
import Token from '#user/models/token'
import mail from '@adonisjs/mail/services/main'
import VerifyENotification from '#mails/verify_e_notification'
import env from '#start/env'
import { cuid } from '@adonisjs/core/helpers'

export default class RegisterController {
  async handle({ response, request }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const existing = await User.findBy('email', data.email)
    if (existing) {
      return response.forbidden({ cause: 'email', message: 'Email already in use.' })
    }

    const user = await User.create({
      id: cuid(),
      ...data,
    })
    const token = await Token.generateToken({
      user,
      relation: 'verifyEmailTokens',
      type: 'VERIFY_EMAIL',
    })
    const resetLink = `${env.get('FRONTEND_URL')}/verify/email/${token}`
    await mail.sendLater(new VerifyENotification(user, resetLink))

    return response.ok('An email has been sent to your email')
  }
}
