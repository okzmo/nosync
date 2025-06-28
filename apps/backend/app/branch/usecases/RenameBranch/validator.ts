import vine from '@vinejs/vine'

export const renameBranchValidator = vine.compile(
  vine.object({
    branchId: vine.string(),
    name: vine.string().maxLength(32),
  })
)
