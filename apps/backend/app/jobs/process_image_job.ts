import { Job } from '@rlanz/bull-queue'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import Cell from '#cell/models/cell'
import drive from '@adonisjs/drive/services/main'
import Media from '#media/models/media'
import transmit from '@adonisjs/transmit/services/main'

interface ProcessImageJobPayload {
  spaceId: string
  branchId: string
  fileKey: string
  cellId: number
}

export default class ProcessImageJob extends Job {
  static get $$filepath() {
    return import.meta.url
  }

  async handle({ fileKey, cellId, spaceId, branchId }: ProcessImageJobPayload) {
    const file = await drive.use('fs').getBytes(fileKey)

    await drive.use('s3').put(fileKey, file)
    await drive.use('fs').delete(fileKey)

    const result = await generateText({
      model: openai('gpt-4o-mini'),
      maxTokens: 100,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'List only comma-separated single-word tags for this image. Start with the most important objects and characteristics. Never repeat a tag. Give me at least 16 tags and at most 32 tags.',
            },
            {
              type: 'image',
              image: new URL(`https://f003.backblazeb2.com/file/dumpiapp/${fileKey}`),
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
    const media = await Media.findByOrFail('cell_id', cellId)
    cell.tags = result.steps[0].text
    media.url = `https://f003.backblazeb2.com/file/dumpiapp/${fileKey}`
    await media.save()
    await cell.save()

    transmit.broadcast(`space:${spaceId}:branch:${branchId}`, {
      type: 'branch:updateUploadedImage',
      cellId: cellId,
      tags: result.steps[0].text,
      imageUrl: `https://f003.backblazeb2.com/file/dumpiapp/${fileKey}`,
    })
  }

  async rescue(payload: ProcessImageJobPayload) {}
}
