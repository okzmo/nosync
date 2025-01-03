import vine from '@vinejs/vine'

export const searchCellsValidator = vine.compile(
  vine.object({
    branchId: vine.number(),
    query: vine.string().optional(),
  })
)
