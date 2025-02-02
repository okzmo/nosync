import vine from '@vinejs/vine'

export const resetPasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string().minLength(8),
    newPassword: vine.string().minLength(8),
    confirm: vine.string().minLength(8),
  })
)
