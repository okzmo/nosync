import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Cell from '#cell/models/cell'

export default class Branch extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare spaceId: string

  @column()
  declare name: string

  @hasMany(() => Cell)
  declare cells: HasMany<typeof Cell>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
