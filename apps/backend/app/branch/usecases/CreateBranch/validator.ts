import vine from '@vinejs/vine'

export const createBranchValidator = vine.compile(
  vine.object({
    spaceId: vine.string(),
    branchName: vine.string(),
  })
)
