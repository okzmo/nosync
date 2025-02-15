import { Job } from '@rlanz/bull-queue'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import Cell from '#cell/models/cell'
import drive from '@adonisjs/drive/services/main'
import Media from '#media/models/media'
import transmit from '@adonisjs/transmit/services/main'
import sharp from 'sharp'
import env from '#start/env'

interface ProcessVideoJobPayload {
  spaceId: string
  branchId: string
  thumbnailKey: string
  blurKey: string
  cellId: string
}

export default class ProcessVideoJob extends Job {
  static get $$filepath() {
    return import.meta.url
  }

  async handle({ thumbnailKey, blurKey, cellId, spaceId, branchId }: ProcessVideoJobPayload) {
    const thumbnail = await drive.use('s3').getBytes(thumbnailKey)

    const blurredPic = await sharp(thumbnail).webp({ quality: 50 }).blur(24).toBuffer()
    await drive.use('s3').put(blurKey, blurredPic)
    transmit.broadcast(`space:${spaceId}:branch:${branchId}`, {
      type: 'branch:finishBlurredThumbnailVideoUpload',
      cellId: cellId,
      blurUrl: `${env.get('AWS_CDN_URL')}/${blurKey}`,
    })

    transmit.broadcast(`space:${spaceId}:branch:${branchId}`, {
      type: 'branch:finishThumbnailVideoUpload',
      cellId: cellId,
      thumbnailUrl: `${env.get('AWS_CDN_URL')}/${thumbnailKey}`,
    })

    const media = await Media.findByOrFail('cell_id', cellId)
    media.thumbnailUrl = `${env.get('AWS_CDN_URL')}/${thumbnailKey}`
    media.blurUrl = `${env.get('AWS_CDN_URL')}/${blurKey}`
    await media.save()

    const result = await generateText({
      model: openai('gpt-4o-mini'),
      maxTokens: 100,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `List only comma-separated single-word tags for this image.
                     Start with the most important objects and characteristics. Never repeat a tag.
                     Give me at least 16 tags and at most 32 tags. The first tag must always be "video"`,
            },
            {
              type: 'image',
              image: new URL(`${env.get('AWS_CDN_URL')}/${thumbnailKey}`),
              experimental_providerMetadata: {
                openai: {
                  imageDetail: 'low',
                },
              },
            },
          ],
        },
      ],
    })

    const cell = await Cell.findOrFail(cellId)
    cell.tags = result.steps[0].text
    await cell.save()

    transmit.broadcast(`space:${spaceId}:branch:${branchId}`, {
      type: 'branch:finishTagsCreation',
      cellId: cellId,
      tags: result.steps[0].text,
    })
  }

  async rescue(_payload: ProcessVideoJobPayload) {}
}
