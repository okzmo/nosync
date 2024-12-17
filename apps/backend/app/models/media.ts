import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Media extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cell_id: number

  @column()
  declare width: number

  @column()
  declare height: number

  @column()
  declare mime: string

  @column()
  declare tags: string[]

  @column()
  declare duration: number

  @column()
  declare blur_hash: string

  @column()
  declare file_size: number

  @column()
  declare thumbnail_url: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
