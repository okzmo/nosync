import env from '#start/env'
import type { ApplicationService } from '@adonisjs/core/types'
import { MeiliSearch } from 'meilisearch'

export default class MeilisearchProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.bind('meili', () => {
      return new MeiliSearch({
        host: env.get('MEILI_HOST'),
        apiKey: env.get('MEILI_MASTER_KEY'),
      })
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
