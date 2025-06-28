import User from '#user/models/user'
import { cuid } from '@adonisjs/core/helpers'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        id: cuid(),
        email: 'math@brea.sh',
        password: 'secret',
        firstTime: true,
      },
      {
        id: cuid(),
        email: 'john@brea.sh',
        password: 'secret',
        firstTime: true,
      },
      {
        id: cuid(),
        email: 'mike@brea.sh',
        password: 'secret',
        firstTime: true,
      },
    ])
  }
}
