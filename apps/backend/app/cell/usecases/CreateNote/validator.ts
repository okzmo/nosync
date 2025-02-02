import vine from '@vinejs/vine'

export const createNoteValidator = vine.compile(
  vine.object({
    title: vine.string().optional(),
    branchId: vine.number(),
  })
)
