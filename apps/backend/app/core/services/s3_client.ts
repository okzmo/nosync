import env from '#start/env'
import { S3Client } from '@aws-sdk/client-s3'

const client = new S3Client({
  credentials: {
    accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
  },
  region: env.get('AWS_REGION'),
})

export { client as default }
