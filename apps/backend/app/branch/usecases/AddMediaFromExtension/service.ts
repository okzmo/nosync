import { cuid } from '@adonisjs/core/helpers'
import { addMediaFromExtensionValidator } from './validators.js'
import { InferInput } from '@vinejs/vine/types'
import queue from '@rlanz/bull-queue/services/main'
import ProcessImageJob from '#jobs/process_image_job'
import sharp from 'sharp'
import drive from '@adonisjs/drive/services/main'
import Cell from '#cell/models/cell'
import Media from '#media/models/media'
import env from '#start/env'
import transmit from '@adonisjs/transmit/services/main'

export class AddMediaFromExtensionService {
  async execute(data: InferInput<typeof addMediaFromExtensionValidator>) {
    const { spaceId, branchId, fromUrl, mediaUrl } = data

    const res = await fetch(mediaUrl)
    const buffer = await res.arrayBuffer()
    const metadata = await sharp(buffer).metadata()

    const key = cuid()
    const originalKey = `${key}.${metadata.format || 'webp'}`
    const optimKey = `${key}.webp`
    const blurKey = `${key}_blur.webp`

    const blurredPic = await sharp(buffer).webp({ quality: 50 }).blur(24).toBuffer()
    await drive.use('s3').put(blurKey, blurredPic)

    const cell = new Cell()
    cell.id = cuid()
    cell.branchId = Number.parseInt(branchId)
    cell.tags = ''
    cell.sourceUrl = fromUrl
    cell.type = `image/${metadata.format}` || ''
    const savedCell = await cell.save()

    const media = new Media()
    media.cellId = savedCell.id
    media.originalUrl = `${env.get('AWS_CDN_URL')}/${originalKey}`
    media.resizedUrl = ''
    media.blurUrl = `${env.get('AWS_CDN_URL')}/${blurKey}`
    media.width = metadata.width || 0
    media.height = metadata.height || 0
    media.fileSize = metadata.size || 0
    media.mime = metadata.format || ''
    media.thumbnailUrl = ''
    media.duration = 0
    media.save()

    transmit.broadcast(`space:${spaceId}:branch:${branchId}`, {
      type: 'branch:cellFromExtensionCreated',
      cell: { ...savedCell.toJSON(), media: media.toJSON() },
    })

    await drive.use('s3').put(originalKey, new Uint8Array(buffer))

    queue.dispatch(ProcessImageJob, {
      spaceId,
      branchId,
      originKey: originalKey,
      optimKey: optimKey,
      blurKey: blurKey,
      ignoreBlur: true,
      cellId: savedCell.id,
    })
  }
}
