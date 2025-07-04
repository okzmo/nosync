import vine from '@vinejs/vine'

export const createNoteValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(1).maxLength(32).optional(),
    branchId: vine.string(),
  })
)
