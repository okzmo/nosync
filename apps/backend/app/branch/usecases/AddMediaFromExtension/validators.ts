import vine from '@vinejs/vine'

export const addMediaFromExtensionValidator = vine.compile(
  vine.object({
    spaceId: vine.string(),
    branchId: vine.string(),
    mediaUrl: vine.string(),
    fromUrl: vine.string(),
  })
)
