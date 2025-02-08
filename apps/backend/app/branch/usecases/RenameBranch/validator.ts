import vine from '@vinejs/vine'

export const renameBranchValidator = vine.compile(
  vine.object({
    branchId: vine.number(),
    name: vine.string().maxLength(32),
  })
)
