import vine from '@vinejs/vine'

export const uploadMediaValidator = vine.compile(
  vine.object({
    spaceId: vine.string(),
    branchId: vine.string(),
    files: vine.array(
      vine.file({
        size: '2gb',
        extnames: ['jpg', 'png', 'pdf', 'gif', 'mp4', 'm4v', 'mkv'],
      })
    ),
    thumbnails: vine.array(
      vine.file({
        size: '2gb',
        extnames: ['jpg'],
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
