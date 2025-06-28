import vine from '@vinejs/vine'

export const saveContentValidator = vine.compile(
  vine.object({
    id: vine.string(),
    branchId: vine.string(),
    content: vine.any().optional(),
    searchContent: vine.string().optional(),
  })
)
