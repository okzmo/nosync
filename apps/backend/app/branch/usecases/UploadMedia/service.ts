import Cell from '#cell/models/cell'
import Media from '#media/models/media'
import { cuid } from '@adonisjs/core/helpers'
import { fileMetadata, uploadMediaValidator } from './validators.js'
import queue from '@rlanz/bull-queue/services/main'
import ProcessImageJob from '#jobs/process_image_job'
import sharp from 'sharp'
import { encode } from 'blurhash'
import { InferInput } from '@vinejs/vine/types'

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
      const key = `${cuid()}.${file.extname}`

      const { data: resizedData, info } = await sharp(file.tmpPath)
        .resize(50, 50, { fit: 'inside' })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })
      const blurhash = encode(new Uint8ClampedArray(resizedData), info.width, info.height, 4, 3)

      // temporarly move the image to disk for the jobs in the queue
      await file.moveToDisk(key, 'fs')

      const cell = new Cell()
      cell.branch_id = Number.parseInt(branchId)
      cell.type = metadatas[i].mime
      cell.tags = ''
      const savedCell = await cell.save()

      const media = new Media()
      media.cell_id = savedCell.id
      media.url = ''
      media.width = metadatas[i].width
      media.height = metadatas[i].height
      media.file_size = metadatas[i].size
      media.mime = metadatas[i].mime
      media.blur_hash = blurhash
      media.thumbnail_url = '' // from S3
      media.duration = metadatas[i].duration
      media.save()

      // process the image in the queue for tagging with openai and save to bucket
      await queue.dispatch(ProcessImageJob, {
        spaceId,
        branchId,
        fileKey: key,
        cellId: savedCell.id,
      })

      medias.push({ ...savedCell.toJSON(), media: media.toJSON() })
    }

    return medias
  }
}
