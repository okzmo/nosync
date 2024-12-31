import env from '#start/env'
import { defineConfig } from '@adonisjs/transmit'
import { redis } from '@adonisjs/transmit/transports'

export default defineConfig({
  pingInterval: false,
  transport: {
    driver: redis({
      host: env.get('QUEUE_REDIS_HOST'),
      port: env.get('QUEUE_REDIS_PORT'),
      password: env.get('QUEUE_REDIS_PASSWORD'),
      keyPrefix: 'transmit',
    }),
  },
})
