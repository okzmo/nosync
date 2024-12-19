import vine from '@vinejs/vine'

export const retrieveCellsFromBranch = vine.compile(
  vine.object({
    branchId: vine.number(),
  })
)
