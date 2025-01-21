import Cell from '#cell/models/cell'
import Media from '#media/models/media'
import { cuid } from '@adonisjs/core/helpers'
import { fileMetadata, uploadMediaValidator } from './validators.js'
import queue from '@rlanz/bull-queue/services/main'
import ProcessImageJob from '#jobs/process_image_job'
import sharp from 'sharp'
import { InferInput } from '@vinejs/vine/types'
import drive from '@adonisjs/drive/services/main'

export class UploadMediaService {
  async execute(data: InferInput<typeof uploadMediaValidator>) {
    const { spaceId, branchId, files, filesMetadata } = data
    const medias = []

    // validate the metadatas for each file
    const metadatas = await Promise.all(
      filesMetadata.map((metadata) => fileMetadata.validate(JSON.parse(metadata)))
    )

    // create a cell and a media object in DB for each file
    for (const [i, file] of files.entries()) {
      const key = cuid()
      const originalKey = `${key}.${file.extname}`
      const optimKey = `${key}.webp`

      // blur the image and upload
      const blurredPic = await sharp(file.tmpPath).webp({ quality: 50 }).blur(24).toBuffer()

      await drive.use('s3').put(`${key}_blur.webp`, blurredPic)

      const cell = new Cell()
      cell.branchId = Number.parseInt(branchId)
      cell.type = metadatas[i].mime
      cell.tags = ''
      const savedCell = await cell.save()

      const media = new Media()
      media.cellId = savedCell.id
      media.originalUrl = ''
      media.resizedUrl = ''
      media.blurUrl = `https://f003.backblazeb2.com/file/dumpiapp/${key}_blur.webp`
      media.width = metadatas[i].width
      media.height = metadatas[i].height
      media.fileSize = metadatas[i].size
      media.mime = metadatas[i].mime
      media.thumbnailUrl = '' // from S3
      media.duration = metadatas[i].duration
      media.save()

      medias.push({ ...savedCell.toJSON(), media: media.toJSON() })

      // process the image in the queue for tagging with openai and save to bucket
      await file.moveToDisk(originalKey, 'fs')
      queue.dispatch(ProcessImageJob, {
        spaceId,
        branchId,
        originKey: originalKey,
        optimKey: optimKey,
        cellId: savedCell.id,
      })
    }

    return medias
  }
}
