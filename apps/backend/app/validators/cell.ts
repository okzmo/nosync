import vine from '@vinejs/vine'

export const retrieveCellsFromBranch = vine.compile(
  vine.object({
    branchId: vine.number(),
  })
)

export const saveTitle = vine.compile(
  vine.object({
    id: vine.number(),
    branchId: vine.number(),
    title: vine.string(),
  })
)

export const saveContent = vine.compile(
  vine.object({
    id: vine.number(),
    branchId: vine.number(),
    content: vine.any(),
  })
)
