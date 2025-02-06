import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cells'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('source_url')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('source_url')
    })
  }
}
