import factory from '@adonisjs/lucid/factories'
import User from '#user/models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: faker.internet.email(),
      first_time: faker.datatype.boolean(),
      password: faker.internet.password(),
    }
  })
  .build()
