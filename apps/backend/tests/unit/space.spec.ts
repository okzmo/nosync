import { UserFactory } from '#database/factories/user_factory'
import Space from '#models/space'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('space', (group) => {
  let user: User

  group.each.setup(async () => {
    await testUtils.db().truncate()
    user = await UserFactory.create()
  })

  test('create a space', async ({ client, assert }) => {
    const spaceData = {
      name: 'space_name',
    }

    const request = client.post('/v1/space/create').json(spaceData).loginAs(user)
    request.dump()
    const response = await request.send()

    response.assertStatus(200)

    // const space = await Space.query().where('owner_id', user.id).first()
    //
    // assert.exists(space)
    // assert.equal(space?.name, spaceData.name)
  })
})
