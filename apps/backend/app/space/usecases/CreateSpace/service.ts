import Branch from '#branch/models/branch'
import Space from '#space/models/space'

export class CreateSpaceService {
  async execute(userId: number, spaceName: string) {
    const space = new Space()
    space.owner_id = userId
    space.name = spaceName
    const createdSpace = await space.save()

    const branch = new Branch()
    branch.space_id = createdSpace.id
    branch.name = 'root'
    await branch.save()
  }
}
