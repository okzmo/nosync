import Branch from '#branch/models/branch'
import Space from '#space/models/space'

export class CreateSpaceService {
  async execute(userId: number, spaceName: string) {
    const newSpace = await Space.create({ name: spaceName, owner_id: userId })

    const newBranch = await Branch.create({ space_id: newSpace.id, name: 'root' })

    return { ...newSpace, branches: [newBranch] }
  }
}
