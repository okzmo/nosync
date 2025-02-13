import vine from '@vinejs/vine'

export const saveContentValidator = vine.compile(
  vine.object({
    id: vine.string(),
    branchId: vine.number(),
    content: vine.any(),
    searchContent: vine.string(),
  })
)
