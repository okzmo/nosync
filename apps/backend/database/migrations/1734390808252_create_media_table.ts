import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'media'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('cell_id').notNullable().references('cells.id').onDelete('CASCADE')
      table.integer('width').unsigned().notNullable()
      table.integer('height').unsigned().notNullable()
      table.integer('file_size').unsigned().notNullable()
      table.string('mime').notNullable()
      table.integer('duration').unsigned()

      table.string('original_url')
      table.string('resized_url')
      table.string('blur_url')
      table.string('thumbnail_url')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
