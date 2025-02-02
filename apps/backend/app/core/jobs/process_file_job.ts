import { Job } from '@rlanz/bull-queue'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import Cell from '#cell/models/cell'
import drive from '@adonisjs/drive/services/main'
import Media from '#media/models/media'
import transmit from '@adonisjs/transmit/services/main'
import env from '#start/env'

interface ProcessFileJobPayload {
  spaceId: string
  branchId: string
  originKey: string
  cellId: string
}

export default class ProcessFileJob extends Job {
  static get $$filepath() {
    return import.meta.url
  }

  async handle({ originKey, cellId, spaceId, branchId }: ProcessFileJobPayload) {
    const file = await drive.use('fs').getBytes(originKey)

    await drive.use('s3').put(originKey, file)
    transmit.broadcast(`space:${spaceId}:branch:${branchId}`, {
      type: 'branch:finishOriginalFileUpload',
      cellId: cellId,
      originalUrl: `${env.get('AWS_CDN_URL')}/${originKey}`,
    })

    await drive.use('fs').delete(originKey)

    const media = await Media.findByOrFail('cell_id', cellId)
    media.originalUrl = `${env.get('AWS_CDN_URL')}/${originKey}`
    await media.save()

    //TODO: use claude to analyze pdfs/files in general
    //NOTE: It seems openai doesn't support attaching pdf and
    // analyze it so i'll probably have to use anthropic. You can
    // technically transform the pdf to a base64 and send that but
    // it seems clunky.

    // const result = await generateText({
    //   model: openai('gpt-4o'),
    //   maxTokens: 100,
    //   messages: [
    //     {
    //       role: 'user',
    //       content: [
    //         {
    //           type: 'text',
    //           text: `List only comma-separated single-word tags for this pdf file.
    //                  Start with the most important objects and characteristics. Never repeat a tag.
    //                  Give me at least 16 tags and at most 32 tags. The first tag must always be "pdf"`,
    //         },
    //         {
    //           type: 'file',
    //           data: new URL(`${env.get('AWS_CDN_URL')}/${originKey}`),
    //           mimeType: 'application/pdf',
    //         },
    //       ],
    //     },
    //   ],
    // })

    const cell = await Cell.findOrFail(cellId)
    // cell.tags = result.steps[0].text
    cell.tags = 'pdf'
    await cell.save()

    // transmit.broadcast(`space:${spaceId}:branch:${branchId}`, {
    //   type: 'branch:finishTagsCreation',
    //   cellId: cellId,
    //   tags: result.steps[0].text,
    // })
  }

  async rescue(_payload: ProcessFileJobPayload) {}
}
