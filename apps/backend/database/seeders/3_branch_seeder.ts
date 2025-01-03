import Branch from '#branch/models/branch'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Branch.createMany([
      {
        space_id: 1,
        name: 'root',
      },
      {
        space_id: 2,
        name: 'root',
      },
      {
        space_id: 3,
        name: 'root',
      },
      {
        space_id: 1,
        name: 'wallpapers',
      },
    ])
  }
}
