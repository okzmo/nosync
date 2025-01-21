import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail({ gmail_remove_dots: false }),
    password: vine.string().minLength(8),
  })
)
