import User from '#user/models/user'
import { BaseMail } from '@adonisjs/mail'

export default class VerifyENotification extends BaseMail {
  from = 'Acme <onboarding@resend.dev>'
  subject = 'Verify email'

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
Please verify your email address by visiting ${this.url} and clicking the verification link.
`)
    this.message.html(`
<h1>Please verify your email address</h1>
<p>Click the link below to verify your email address.</p>
<a href="${this.url}">Verify email address</a>
`)
  }
}
