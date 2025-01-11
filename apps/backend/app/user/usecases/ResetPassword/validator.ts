import vine from '@vinejs/vine'

export const resetPasswordSendValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    newPassword: vine.string().minLength(8),
  })
)

export const checkToken = vine.compile(
  vine.object({
    token: vine.string().minLength(64),
  })
)
