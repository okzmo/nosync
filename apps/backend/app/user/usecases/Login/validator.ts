import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail({ gmail_remove_dots: false }),
    password: vine.string(),
  })
)
