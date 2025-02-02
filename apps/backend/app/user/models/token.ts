import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#user/models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import stringHelpers from '@adonisjs/core/helpers/string'

type TokenType = 'PASSWORD_RESET' | 'VERIFY_EMAIL'
type RelationType = 'passwordResetTokens' | 'verifyEmailTokens'

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare type: string

  @column()
  declare token: string

  @column.dateTime()
  declare expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  static async generateToken({
    user,
    relation,
    type,
  }: {
    user: User | null
    relation: RelationType
    type: TokenType
  }) {
    const token = stringHelpers.generateRandom(64)

    if (!user) return token

    await Token.expireTokens(user, relation)
    const record = await user.related('tokens').create({
      type: type,
      expiresAt: DateTime.now().plus({ minutes: 15 }),
      token,
    })

    return record.token
  }

  static async expireTokens(user: User, relation: RelationType) {
    await user
      .related(relation)
      .query()
      .update({
        expiresAt: DateTime.now().minus({ second: 1 }),
      })
  }

  static async getTokenUser(token: string, type: TokenType) {
    const record = await Token.query()
      .preload('user')
      .where('token', token)
      .where('type', type)
      .where('expiresAt', '>', DateTime.now().toSQL())
      .orderBy('createdAt', 'desc')
      .first()

    return record?.user
  }

  static async verify(token: string, type: TokenType) {
    const record = await Token.query()
      .where('expiresAt', '>', DateTime.now().toSQL())
      .where('token', token)
      .where('type', type)
      .first()

    return Boolean(record)
  }
}
