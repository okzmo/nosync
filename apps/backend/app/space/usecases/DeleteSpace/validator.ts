import vine from '@vinejs/vine'

export const deleteSpaceValidator = vine.compile(
  vine.object({
    spaceId: vine.number(),
  })
)
