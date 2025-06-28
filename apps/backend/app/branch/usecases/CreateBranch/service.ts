import Branch from '#branch/models/branch'
import { cuid } from '@adonisjs/core/helpers'

export class CreateBranchService {
  async execute(data: { spaceId: string; branchName: string }) {
    const { branchName, spaceId } = data
    return await Branch.create({ id: cuid(), name: branchName, spaceId: spaceId })
  }
}
