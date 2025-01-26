import Space from '#space/models/space'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Space.createMany([
      {
        userId: 1,
        name: 'life',
      },
      {
        userId: 1,
        name: 'work',
      },
      {
        userId: 2,
        name: 'personal',
      },
      {
        userId: 3,
        name: 'core',
      },
    ])
  }
}
