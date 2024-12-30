import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import Space from '#space/models/space'
import User from '#user/models/user'

test.group('space', (group) => {
  let user: User

  group.each.setup(async () => {
    await testUtils.db().truncate()
    user = await UserFactory.create()
  })

  test('create a space', async ({ client, assert, route }) => {
    const spaceData = {
      name: 'myspace',
    }

    const response = await client.post(route('space.create')).json(spaceData).loginAs(user)

    response.assertStatus(200)

    const space = await Space.query().where('owner_id', user.id).first()

    assert.exists(space)
    assert.equal(space?.name, spaceData.name)
  })
})
