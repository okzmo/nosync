import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Cell extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare branch_id: number

  @column()
  declare type: string

  @column()
  declare url: string

  @column()
  declare content: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
