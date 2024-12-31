import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Media from '#media/models/media'

export default class Cell extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare branch_id: number

  @column()
  declare title: string

  @column()
  declare type: string

  @column()
  declare content: string

  @column()
  declare tags: string

  @hasOne(() => Media, { foreignKey: 'cell_id' })
  declare media: HasOne<typeof Media>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
