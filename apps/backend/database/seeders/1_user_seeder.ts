import User from '#user/models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        email: 'math@brea.sh',
        password: 'secret',
        firstTime: true,
      },
      {
        email: 'john@brea.sh',
        password: 'secret',
        firstTime: true,
      },
      {
        email: 'mike@brea.sh',
        password: 'secret',
        firstTime: true,
      },
    ])
  }
}
