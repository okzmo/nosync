import Space from '#space/models/space'
import { cuid } from '@adonisjs/core/helpers'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Space.createMany([
      {
        userId: cuid(),
        name: 'life',
      },
      {
        userId: cuid(),
        name: 'work',
      },
      {
        userId: cuid(),
        name: 'personal',
      },
      {
        userId: cuid(),
        name: 'core',
      },
    ])
  }
}
