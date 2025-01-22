import { Job } from '@rlanz/bull-queue'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import Cell from '#cell/models/cell'
import drive from '@adonisjs/drive/services/main'
import Media from '#media/models/media'
import transmit from '@adonisjs/transmit/services/main'
import sharp from 'sharp'

interface ProcessVideoJobPayload {
  spaceId: string
  branchId: string
  originKey: string
  thumbnailKey: string
  cellId: number
}

const RESIZED_SIZE = 600

export default class ProcessVideoJob extends Job {
  static get $$filepath() {
    return import.meta.url
  }

  async handle({ originKey, thumbnailKey, cellId, spaceId, branchId }: ProcessVideoJobPayload) {
    const video = await drive.use('fs').getBytes(originKey)
    const thumbnail = await drive.use('fs').getBytes(thumbnailKey)

    const optimizedThumbnail = await sharp(thumbnail)
      .resize(RESIZED_SIZE)
      .webp({ quality: 75, effort: 4 })
      .toBuffer()

    await drive.use('s3').put(thumbnailKey, optimizedThumbnail)
    transmit.broadcast(`space:${spaceId}:branch:${branchId}`, {
      type: 'branch:finishThumbnailVideoUpload',
      cellId: cellId,
      thumbnailUrl: `https://f003.backblazeb2.com/file/dumpiapp/${thumbnailKey}`,
    })

    await drive.use('s3').put(originKey, video)
    transmit.broadcast(`space:${spaceId}:branch:${branchId}`, {
      type: 'branch:finishOriginalVideoUpload',
      cellId: cellId,
      originalUrl: `https://f003.backblazeb2.com/file/dumpiapp/${originKey}`,
    })

    await drive.use('fs').delete(originKey)
    await drive.use('fs').delete(thumbnailKey)

    const media = await Media.findByOrFail('cell_id', cellId)
    media.originalUrl = `https://f003.backblazeb2.com/file/dumpiapp/${originKey}`
    media.thumbnailUrl = `https://f003.backblazeb2.com/file/dumpiapp/${thumbnailKey}`
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
              image: new URL(`https://f003.backblazeb2.com/file/dumpiapp/${thumbnailKey}`),
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
