import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cells'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('branch_id').unsigned().references('branches.id').onDelete('CASCADE')
      table.string('title')
      table.string('type').notNullable()
      table.string('content')
      table.jsonb('tags').defaultTo('[]')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
