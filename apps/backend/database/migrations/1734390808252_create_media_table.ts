import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'media'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('cell_id').unsigned().references('cells.id').onDelete('CASCADE')
      table.string('url').notNullable()
      table.integer('width').unsigned().notNullable()
      table.integer('height').unsigned().notNullable()
      table.integer('file_size').unsigned().notNullable()
      table.string('mime').notNullable()
      table.string('blur_hash').notNullable()
      table.string('thumbnail_url')
      table.integer('duration').unsigned()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
