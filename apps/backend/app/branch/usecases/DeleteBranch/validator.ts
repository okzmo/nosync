import vine from '@vinejs/vine'

export const deleteBranchValidator = vine.compile(
  vine.object({
    branchId: vine.number(),
  })
)
