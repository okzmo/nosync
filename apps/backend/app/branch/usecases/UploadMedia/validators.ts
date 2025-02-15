import vine from '@vinejs/vine'

export const uploadMediaValidator = vine.compile(
  vine.object({
    spaceId: vine.string(),
    branchId: vine.string(),
    title: vine.string().optional(),
    filesMetadata: vine.array(vine.string()),
  })
)

export const fileMetadata = vine.compile(
  vine.object({
    id: vine.string(),
    width: vine.number(),
    height: vine.number(),
    name: vine.string(),
    mime: vine.string(),
    size: vine.number(),
    duration: vine.number(),
  })
)
