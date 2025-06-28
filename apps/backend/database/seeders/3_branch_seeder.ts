import Branch from '#branch/models/branch'
import { cuid } from '@adonisjs/core/helpers'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Branch.createMany([
      {
        spaceId: cuid(),
        name: 'root',
      },
      {
        spaceId: cuid(),
        name: 'root',
      },
      {
        spaceId: cuid(),
        name: 'root',
      },
      {
        spaceId: cuid(),
        name: 'wallpapers',
      },
    ])
  }
}
