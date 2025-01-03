import Space from '#space/models/space'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Space.createMany([
      {
        owner_id: 1,
        name: 'life',
      },
      {
        owner_id: 1,
        name: 'work',
      },
      {
        owner_id: 2,
        name: 'personal',
      },
      {
        owner_id: 3,
        name: 'core',
      },
    ])
  }
}
