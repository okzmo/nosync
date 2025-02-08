import vine from '@vinejs/vine'

export const renameSpaceValidator = vine.compile(
  vine.object({
    spaceId: vine.number(),
    name: vine.string().maxLength(32),
  })
)
