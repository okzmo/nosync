import vine from '@vinejs/vine'

export const createBranchValidator = vine.compile(
  vine.object({
    spaceId: vine.string(),
    branchName: vine.string().minLength(1).maxLength(20).trim(),
  })
)
