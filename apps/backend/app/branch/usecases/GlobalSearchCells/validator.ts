import vine from '@vinejs/vine'

export const globalSearchCellsValidator = vine.compile(
  vine.object({
    query: vine.string(),
  })
)
