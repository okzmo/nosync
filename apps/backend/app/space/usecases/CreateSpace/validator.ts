import vine from '@vinejs/vine'

export const createSpaceValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(32),
  })
)
