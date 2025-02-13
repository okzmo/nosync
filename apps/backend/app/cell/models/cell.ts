import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Media from '#media/models/media'

export default class Cell extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare branchId: number

  @column()
  declare title: string

  @column()
  declare type: string

  @column()
  declare content: string

  @column()
  declare searchContent: string

  @column()
  declare tags: string

  @column()
  declare sourceUrl: string

  @hasOne(() => Media)
  declare media: HasOne<typeof Media>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
