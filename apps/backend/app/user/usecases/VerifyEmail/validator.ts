import vine from '@vinejs/vine'

export const verifyEmailSendValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
  })
)

export const checkToken = vine.compile(
  vine.object({
    token: vine.string().minLength(64),
  })
)
