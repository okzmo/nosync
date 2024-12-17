import vine from '@vinejs/vine'

export const createSpace = vine.compile(
  vine.object({
    name: vine.string().maxLength(32),
  })
)
