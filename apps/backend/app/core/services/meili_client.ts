import env from '#start/env'
import { MeiliSearch } from 'meilisearch'

const client = new MeiliSearch({
  host: env.get('MEILI_HOST'),
  apiKey: env.get('MEILI_MASTER_KEY'),
})

export { client as default }
