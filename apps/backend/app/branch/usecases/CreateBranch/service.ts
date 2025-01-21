import Branch from '#branch/models/branch'

export class CreateBranchService {
  async execute(data: { spaceId: number; branchName: string }) {
    const { branchName, spaceId } = data
    return await Branch.create({ name: branchName, spaceId: spaceId })
  }
}
