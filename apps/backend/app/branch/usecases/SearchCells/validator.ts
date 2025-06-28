import vine from '@vinejs/vine'

export const searchCellsValidator = vine.compile(
  vine.object({
    branchId: vine.string(),
    query: vine.string().optional(),
  })
)
