import Branch from '#branch/models/branch'
import Cell from '#cell/models/cell'
import Space from '#space/models/space'
import { cuid } from '@adonisjs/core/helpers'
import { GET_STARTED_NOTE, GET_STARTED_NOTE_TEXT_ONLY } from './constant.js'

export class CreateSpaceService {
  async execute(userId: string, spaceName: string, firstSpace: boolean) {
    const newSpace = await Space.create({ id: cuid(), name: spaceName, userId: userId })
    const newBranch = await Branch.create({ id: cuid(), spaceId: newSpace.id, name: 'root' })

    if (firstSpace) {
      await Cell.create({
        id: cuid(),
        branchId: newBranch.id,
        title: 'Get Started',
        tags: 'notes',
        content: JSON.stringify(GET_STARTED_NOTE),
        searchContent: GET_STARTED_NOTE_TEXT_ONLY,
        type: 'note',
      })
    }

    return { ...newSpace, branches: [newBranch] }
  }
}
