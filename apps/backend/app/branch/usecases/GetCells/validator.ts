import vine from '@vinejs/vine'

export const getCellsValidator = vine.compile(
  vine.object({
    branchId: vine.number(),
  })
)
