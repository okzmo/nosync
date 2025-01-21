import Branch from '#branch/models/branch'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Branch.createMany([
      {
        spaceId: 1,
        name: 'root',
      },
      {
        spaceId: 2,
        name: 'root',
      },
      {
        spaceId: 3,
        name: 'root',
      },
      {
        spaceId: 1,
        name: 'wallpapers',
      },
    ])
  }
}
