import vine from '@vinejs/vine'

export const createNoteValidator = vine.compile(
  vine.object({
    branchId: vine.number(),
  })
)
