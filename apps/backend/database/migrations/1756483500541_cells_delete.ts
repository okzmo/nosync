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

    this.schema.alterTable('spaces', (table) => {
      table.foreign('owner_id').references('users.id').onDelete('CASCADE')
    })

    this.schema.alterTable('branches', (table) => {
      table.foreign('space_id').references('spaces.id').onDelete('CASCADE')
    })

    this.schema.alterTable('cells', (table) => {
      table.foreign('branch_id').references('branches.id').onDelete('CASCADE')
    })

    this.schema.alterTable('tokens', (table) => {
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
    })

    this.schema.alterTable('remember_me_tokens', (table) => {
      table.foreign('tokenable_id').references('users.id').onDelete('CASCADE')
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
