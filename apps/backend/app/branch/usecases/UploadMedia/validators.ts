import vine from '@vinejs/vine'

export const uploadMediaValidator = vine.compile(
  vine.object({
    branchId: vine.string(),
    files: vine.array(
      vine.file({
        size: '5gb',
        extnames: ['jpg', 'png', 'pdf', 'gif'],
      })
    ),
    filesMetadata: vine.array(vine.string()),
  })
)

export const fileMetadata = vine.compile(
  vine.object({
    width: vine.number(),
    height: vine.number(),
    name: vine.string(),
    mime: vine.string(),
    size: vine.number(),
    duration: vine.number(),
  })
)
