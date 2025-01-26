import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Media extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cellId: string

  @column()
  declare originalUrl: string

  @column()
  declare resizedUrl: string

  @column()
  declare blurUrl: string

  @column()
  declare width: number

  @column()
  declare height: number

  @column()
  declare mime: string

  @column()
  declare duration: number

  @column()
  declare fileSize: number

  @column()
  declare thumbnailUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
