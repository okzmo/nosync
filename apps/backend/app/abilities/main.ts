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
export const ownSpace = Bouncer.ability(async (user: User, branch: Branch) => {
  return await Space.query().where('id', branch.space_id).where('owner_id', user.id).then(Boolean)
})
