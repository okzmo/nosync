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

import { Bouncer } from '@adonisjs/bouncer'
import Space from '#space/models/space'
import User from '#user/models/user'
import Branch from '#branch/models/branch'

export const ownSpace = Bouncer.ability(async (user: User, space: Space) => {
  return await Space.query().where('id', space.id).where('owner_id', user.id).then(Boolean)
})

export const ownBranch = Bouncer.ability(async (user: User, branch: Branch) => {
  return await Space.query().where('id', branch.spaceId).where('owner_id', user.id).then(Boolean)
})

export const canCreateBranch = Bouncer.ability(async (user: User, space: Space) => {
  return await Space.query().where('id', space.id).where('owner_id', user.id).then(Boolean)
})

export const canDeleteSpace = Bouncer.ability(async (user: User, space: Space) => {
  const userSpaces = await Space.query().where('owner_id', user.id).orderBy('created_at', 'asc')

  return userSpaces[0].id !== space.id
})

export const canDeleteBranch = Bouncer.ability(async (_: User, branch: Branch) => {
  const userBranches = await Branch.query()
    .where('space_id', branch.spaceId)
    .orderBy('created_at', 'asc')

  return userBranches[0].id !== branch.id
})
