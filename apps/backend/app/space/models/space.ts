import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Branch from '#branch/models/branch'

export default class Space extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare owner_id: number

  @column()
  declare name: string

  @hasMany(() => Branch, { foreignKey: 'space_id' })
  declare branches: HasMany<typeof Branch>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
