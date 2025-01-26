import vine from '@vinejs/vine'

export const saveTitleValidator = vine.compile(
  vine.object({
    id: vine.string(),
    branchId: vine.number(),
    title: vine.string(),
  })
)
