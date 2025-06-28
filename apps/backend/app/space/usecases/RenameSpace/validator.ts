import vine from '@vinejs/vine'

export const renameSpaceValidator = vine.compile(
  vine.object({
    spaceId: vine.string(),
    name: vine.string().maxLength(32),
  })
)
