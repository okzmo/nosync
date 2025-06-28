import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // drop fk key
    this.schema.alterTable('spaces', (table) => {
      table.dropForeign('owner_id')
    })

    this.schema.alterTable('branches', (table) => {
      table.dropForeign('space_id')
    })

    this.schema.alterTable('cells', (table) => {
      table.dropForeign('branch_id')
    })

    this.schema.alterTable('tokens', (table) => {
      table.dropForeign('user_id')
    })

    this.schema.alterTable('remember_me_tokens', (table) => {
      table.dropForeign('tokenable_id')
    })

    // drop primary key
    this.schema.raw('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey CASCADE')
    this.schema.raw('ALTER TABLE spaces DROP CONSTRAINT IF EXISTS spaces_pkey CASCADE')
    this.schema.raw('ALTER TABLE branches DROP CONSTRAINT IF EXISTS branches_pkey CASCADE')

    this.schema.alterTable('users', (table) => {
      table.string('id').notNullable().alter()
    })

    this.schema.alterTable('spaces', (table) => {
      table.string('id').notNullable().alter()
      table.string('owner_id').alter()
    })

    this.schema.alterTable('branches', (table) => {
      table.string('id').notNullable().alter()
      table.string('space_id').alter()
    })

    this.schema.alterTable('cells', (table) => {
      table.string('branch_id').alter()
    })

    this.schema.alterTable('tokens', (table) => {
      table.string('user_id').alter()
    })

    this.schema.alterTable('remember_me_tokens', (table) => {
      table.string('tokenable_id').alter()
    })

    this.schema.alterTable('users', (table) => {
      table.primary(['id'])
    })

    this.schema.alterTable('spaces', (table) => {
      table.primary(['id'])
    })

    this.schema.alterTable('branches', (table) => {
      table.primary(['id'])
    })

    this.schema.alterTable('spaces', (table) => {
      table.foreign('owner_id').references('users.id')
    })

    this.schema.alterTable('branches', (table) => {
      table.foreign('space_id').references('spaces.id')
    })

    this.schema.alterTable('cells', (table) => {
      table.foreign('branch_id').references('branches.id')
    })

    this.schema.alterTable('tokens', (table) => {
      table.foreign('user_id').references('users.id')
    })

    this.schema.alterTable('remember_me_tokens', (table) => {
      table.foreign('tokenable_id').references('users.id')
    })
  }

  async down() {
    this.schema.alterTable('spaces', (table) => {
      table.dropForeign('owner_id')
    })

    this.schema.alterTable('branches', (table) => {
      table.dropForeign('space_id')
    })

    this.schema.alterTable('cells', (table) => {
      table.dropForeign('branch_id')
    })

    this.schema.alterTable('tokens', (table) => {
      table.dropForeign('user_id')
    })

    this.schema.alterTable('remember_me_tokens', (table) => {
      table.dropForeign('tokenable_id')
    })

    this.schema.raw('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey CASCADE')
    this.schema.raw('ALTER TABLE spaces DROP CONSTRAINT IF EXISTS spaces_pkey CASCADE')
    this.schema.raw('ALTER TABLE branches DROP CONSTRAINT IF EXISTS branches_pkey CASCADE')

    this.schema.alterTable('users', (table) => {
      table.integer('id').notNullable().alter()
    })

    this.schema.alterTable('spaces', (table) => {
      table.integer('id').notNullable().alter()
      table.integer('owner_id').alter()
    })

    this.schema.alterTable('branches', (table) => {
      table.integer('id').notNullable().alter()
      table.integer('space_id').alter()
    })

    this.schema.alterTable('cells', (table) => {
      table.integer('branch_id').alter()
    })

    this.schema.alterTable('tokens', (table) => {
      table.integer('user_id').alter()
    })

    this.schema.alterTable('remember_me_tokens', (table) => {
      table.integer('tokenable_id').alter()
    })

    this.schema.alterTable('users', (table) => {
      table.primary(['id'])
    })

    this.schema.alterTable('spaces', (table) => {
      table.primary(['id'])
    })

    this.schema.alterTable('branches', (table) => {
      table.primary(['id'])
    })

    this.schema.alterTable('spaces', (table) => {
      table.foreign('owner_id').references('users.id')
    })

    this.schema.alterTable('branches', (table) => {
      table.foreign('space_id').references('spaces.id')
    })

    this.schema.alterTable('cells', (table) => {
      table.foreign('branch_id').references('branches.id')
    })

    this.schema.alterTable('tokens', (table) => {
      table.foreign('user_id').references('users.id')
    })

    this.schema.alterTable('remember_me_tokens', (table) => {
      table.foreign('tokenable_id').references('users.id')
    })
  }
}
