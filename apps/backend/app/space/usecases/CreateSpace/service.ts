import Branch from '#branch/models/branch'
import Space from '#space/models/space'
import { cuid } from '@adonisjs/core/helpers'

export class CreateSpaceService {
  async execute(userId: string, spaceName: string) {
    const newSpace = await Space.create({ id: cuid(), name: spaceName, userId: userId })
    const newBranch = await Branch.create({ id: cuid(), spaceId: newSpace.id, name: 'root' })

    return { ...newSpace, branches: [newBranch] }
  }
}
