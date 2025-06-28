import vine from '@vinejs/vine'

export const moveCellValidator = vine.compile(
  vine.object({
    id: vine.string(),
    branchId: vine.string(),
  })
)
