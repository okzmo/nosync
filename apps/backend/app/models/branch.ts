import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Cell from './cell.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Branch extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare space_id: number

  @column()
  declare name: string

  @hasMany(() => Cell, { foreignKey: 'branch_id' })
  declare cells: HasMany<typeof Cell>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
