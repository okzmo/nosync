import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Space from '#space/models/space'
import Token from './token.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare firstTime: boolean

  @column()
  declare isEmailVerified: boolean

  @hasMany(() => Space, { foreignKey: 'owner_id' })
  declare spaces: HasMany<typeof Space>

  @hasMany(() => Token)
  declare tokens: HasMany<typeof Token>

  @hasMany(() => Token, { onQuery: (query) => query.where('type', 'PASSWORD_RESET') })
  declare passwordResetTokens: HasMany<typeof Token>

  @hasMany(() => Token, { onQuery: (query) => query.where('type', 'VERIFY_EMAIL') })
  declare verifyEmailTokens: HasMany<typeof Token>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)
}
