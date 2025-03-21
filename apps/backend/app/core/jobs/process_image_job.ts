import { Job } from '@rlanz/bull-queue'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import Cell from '#cell/models/cell'
import drive from '@adonisjs/drive/services/main'
import Media from '#media/models/media'
import transmit from '@adonisjs/transmit/services/main'
import sharp from 'sharp'
import env from '#start/env'

interface ProcessImageJobPayload {
  userId: number
  spaceId: string
  branchId: string
  originKey: string
  optimKey: string
  blurKey: string
  ignoreBlur?: boolean
  cellId: string
}

const RESIZED_SIZE = 600

export default class ProcessImageJob extends Job {
  static get $$filepath() {
    return import.meta.url
  }

  async handle({
    originKey,
    optimKey,
    blurKey,
    ignoreBlur = false,
    userId,
    cellId,
    spaceId,
    branchId,
  }: ProcessImageJobPayload) {
    const file = await drive.use('s3').getBytes(originKey)

    const isAnimated = originKey.includes('gif')
    const optimizedImage = await sharp(file, {
      animated: isAnimated,
      pages: isAnimated ? -1 : undefined,
    })
      .resize(RESIZED_SIZE)
      .webp({ quality: 75, force: true, effort: 4 })
      .toBuffer()

    if (!ignoreBlur) {
      const blurredPic = await sharp(file).webp({ quality: 50 }).blur(24).toBuffer()
      await drive.use('s3').put(blurKey, blurredPic)
      transmit.broadcast(`user/${userId}/space/${spaceId}/branch/${branchId}`, {
        type: 'branch:finishBlurredImageUpload',
        cellId: cellId,
        blurUrl: `${env.get('AWS_CDN_URL')}/${blurKey}`,
      })
    }

    await drive.use('s3').put(optimKey, optimizedImage)
    transmit.broadcast(`user/${userId}/space/${spaceId}/branch/${branchId}`, {
      type: 'branch:finishResizedImageUpload',
      cellId: cellId,
      resizedUrl: `${env.get('AWS_CDN_URL')}/${optimKey}`,
    })

    const media = await Media.findByOrFail('cell_id', cellId)
    media.resizedUrl = `${env.get('AWS_CDN_URL')}/${optimKey}`
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
              text: "Create a comma-separated list of single-word tags for this image, starting with the most salient elements, specifically including the artwork's title and artist's name where known (e.g., 'Starry Night,', 'Vincent VanGogh,', 'The Tower of Babel,', 'Pieter Bruegel'). Treat these proper nouns as single, complete tags. Ensure no tag is repeated, and provide between 16 and 32 tags.",
            },
            {
              type: 'image',
              image: new URL(`${env.get('AWS_CDN_URL')}/${optimKey}`),
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

    console.log(`user/${userId}/space/${spaceId}/branch/${branchId}`)
    transmit.broadcast(`user/${userId}/space/${spaceId}/branch/${branchId}`, {
      type: 'branch:finishTagsCreation',
      cellId: cellId,
      tags: result.steps[0].text,
    })
  }

  async rescue(_payload: ProcessImageJobPayload) {}
}
