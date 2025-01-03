import app from '@adonisjs/core/services/app'
import { MeiliSearch } from 'meilisearch'

const client = (await app.container.make('meili')) as MeiliSearch
export { client as default }
