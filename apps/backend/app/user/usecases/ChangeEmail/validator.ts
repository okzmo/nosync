import vine from '@vinejs/vine'

export const changeEmailValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail({ gmail_remove_dots: false }),
  })
)
