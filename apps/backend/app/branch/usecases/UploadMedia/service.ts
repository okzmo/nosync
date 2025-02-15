import Cell from '#cell/models/cell'
import Media from '#media/models/media'
import { cuid } from '@adonisjs/core/helpers'
import { fileMetadata, uploadMediaValidator } from './validators.js'
import queue from '@rlanz/bull-queue/services/main'
import ProcessImageJob from '#jobs/process_image_job'
import sharp from 'sharp'
import { InferInput } from '@vinejs/vine/types'
import drive from '@adonisjs/drive/services/main'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { UnprocessableMediaException } from '#branch/exceptions/unprocessable_media.exception'
import ProcessVideoJob from '#jobs/process_video_job'
import { MissingThumbnailException } from '#branch/exceptions/missing_thumbnail.exception'
import env from '#start/env'
import ProcessFileJob from '#jobs/process_file_job'

interface ImageProps {
  file: MultipartFile
  spaceId: string
  branchId: string
  title?: string | null
  metadata: {
    id: string
    size: number
    width: number
    height: number
    name: string
    mime: string
    duration: number
  }
}

interface VideoProps {
  file: MultipartFile
  spaceId: string
  branchId: string
  title?: string | null
  metadata: {
    id: string
    size: number
    width: number
    height: number
    name: string
    mime: string
    duration: number
  }
  thumbnail: MultipartFile
}

interface FileProps {
  file: MultipartFile
  spaceId: string
  branchId: string
  title?: string | null
  metadata: {
    id: string
    size: number
    name: string
    mime: string
  }
}

export class UploadMediaService {
  async execute(
    data: InferInput<typeof uploadMediaValidator>,
    files: MultipartFile[],
    thumbnails?: MultipartFile[]
  ) {
    const { spaceId, branchId, title, filesMetadata } = data
    const medias = []

    // validate the metadatas for each file
    const metadatas = await Promise.all(
      filesMetadata.map((metadata) => fileMetadata.validate(JSON.parse(metadata)))
    )

    // create a cell and a media object in DB for each file
    for (const [i, file] of files.entries()) {
      switch (file.type) {
        case 'image':
          const [imageCell, imageMedia] = await this.#uploadImage({
            file,
            metadata: metadatas[i],
            title,
            branchId,
            spaceId,
          })
          medias.push({ ...imageCell, media: imageMedia })
          break
        case 'video':
          if (!thumbnails || thumbnails.length <= 0) throw new MissingThumbnailException()

          const thumbnail = thumbnails.find((t) =>
            t.clientName.includes(this.#removeExtension(file.clientName))
          )

          if (!thumbnail) throw new MissingThumbnailException()

          const [videoCell, videoMedia] = await this.#uploadVideo({
            file,
            metadata: metadatas[i],
            thumbnail,
            branchId,
            spaceId,
            title,
          })
          medias.push({ ...videoCell, media: videoMedia })
          break
        case 'application':
          const [fileCell, fileMedia] = await this.#uploadFile({
            file,
            metadata: metadatas[i],
            branchId,
            spaceId,
            title,
          })
          medias.push({ ...fileCell, media: fileMedia })
          break
        default:
          throw new UnprocessableMediaException()
      }
    }

    return medias
  }

  #removeExtension(fileName: string) {
    const dotIndex = fileName.lastIndexOf('.')
    return dotIndex === -1 ? fileName : fileName.substring(0, dotIndex)
  }

  async #uploadImage({ file, metadata, title, branchId, spaceId }: ImageProps) {
    const originalKey = file.meta.fileKey
    const keyNoExt = this.#removeExtension(file.meta.fileKey)
    const optimKey = `${keyNoExt}.webp`
    const blurKey = `${keyNoExt}_blur.webp`

    const cell = new Cell()
    cell.id = metadata.id
    if (title) cell.title = title
    cell.branchId = Number.parseInt(branchId)
    cell.type = metadata.mime
    cell.tags = ''
    const savedCell = await cell.save()

    const media = new Media()
    media.cellId = savedCell.id
    media.originalUrl = `${env.get('AWS_CDN_URL')}/${originalKey}`
    media.resizedUrl = ''
    media.blurUrl = ''
    media.width = metadata.width
    media.height = metadata.height
    media.fileSize = metadata.size
    media.mime = metadata.mime
    media.thumbnailUrl = ''
    media.duration = metadata.duration
    media.save()

    // process the image in the queue for tagging with openai and save to bucket
    // await file.moveToDisk(originalKey, 'fs')
    queue.dispatch(ProcessImageJob, {
      spaceId,
      branchId,
      originKey: originalKey,
      optimKey: optimKey,
      blurKey: blurKey,
      cellId: savedCell.id,
    })

    return [savedCell.toJSON(), media.toJSON()]
  }

  async #uploadVideo({ file, branchId, spaceId, title, metadata, thumbnail }: VideoProps) {
    const originalKey = file.meta.fileKey
    const keyNoExt = this.#removeExtension(file.meta.fileKey)
    const thumbnailKey = thumbnail.meta.fileKey
    const blurKey = `${keyNoExt}_blur.webp`

    const cell = new Cell()
    cell.id = metadata.id
    if (title) cell.title = title
    cell.branchId = Number.parseInt(branchId)
    cell.type = metadata.mime
    cell.tags = ''
    const savedCell = await cell.save()

    const media = new Media()
    media.cellId = savedCell.id
    media.originalUrl = `${env.get('AWS_CDN_URL')}/${originalKey}`
    media.resizedUrl = ''
    media.blurUrl = ''
    media.width = metadata.width
    media.height = metadata.height
    media.fileSize = metadata.size
    media.mime = metadata.mime
    media.thumbnailUrl = ''
    media.duration = metadata.duration
    media.save()

    // process the image in the queue for tagging with openai and save to bucket
    queue.dispatch(ProcessVideoJob, {
      spaceId,
      branchId,
      thumbnailKey: thumbnailKey,
      blurKey: blurKey,
      cellId: savedCell.id,
    })

    return [savedCell.toJSON(), media.toJSON()]
  }

  async #uploadFile({ file, branchId, spaceId, title, metadata }: FileProps) {
    const key = cuid()
    const originalKey = `${key}.${file.extname}`

    const cell = new Cell()
    cell.id = metadata.id
    if (title) cell.title = title
    cell.branchId = Number.parseInt(branchId)
    cell.type = metadata.mime
    cell.tags = ''
    const savedCell = await cell.save()

    const media = new Media()
    media.cellId = savedCell.id
    media.originalUrl = ''
    media.resizedUrl = ''
    media.width = 0
    media.height = 0
    media.fileSize = metadata.size
    media.mime = metadata.mime
    media.thumbnailUrl = ''
    media.duration = 0
    media.save()

    // process the image in the queue for tagging with openai and save to bucket
    await file.moveToDisk(originalKey, 'fs')
    queue.dispatch(ProcessFileJob, {
      spaceId,
      branchId,
      originKey: originalKey,
      cellId: savedCell.id,
    })

    return [savedCell.toJSON(), media.toJSON()]
  }
}
