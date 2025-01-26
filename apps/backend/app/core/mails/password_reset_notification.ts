import User from '#user/models/user'
import { BaseMail } from '@adonisjs/mail'

export default class PasswordResetNotification extends BaseMail {
  from = 'Nosync <no-reply@updates.nosync.app>'
  subject = 'Reset Password'

  constructor(
    private user: User,
    private url: string
  ) {
    super()
    this.user = user
    this.url = url
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    this.message.to(this.user.email)
    this.message.text(`
Please reset your password by visiting ${this.url}.
`)
    this.message.html(`
<h1>Please reset your password</h1>
<p>Click the link below to reset your password.</p>
<a href="${this.url}">Reset password</a>
`)
  }
}
