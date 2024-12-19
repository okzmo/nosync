/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

import Branch from '#models/branch'
import Space from '#models/space'
import User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'

/**
 * Delete the following ability to start from
 * scratch
 */
export const uploadFile = Bouncer.ability(async (user: User, branch: Branch) => {
  const space = await Space.findByOrFail('id', branch.space_id)
  return space.owner_id === user.id
})
