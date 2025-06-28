import vine from '@vinejs/vine'

export const deleteCellValidator = vine.compile(
  vine.object({
    id: vine.string(),
    branchId: vine.string(),
  })
)
