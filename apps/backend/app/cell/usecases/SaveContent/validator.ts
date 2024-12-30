import vine from '@vinejs/vine'

export const saveContentValidator = vine.compile(
  vine.object({
    id: vine.number(),
    branchId: vine.number(),
    content: vine.any(),
  })
)
