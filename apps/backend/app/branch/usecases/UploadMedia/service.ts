import { MissingThumbnailException } from '#branch/exceptions/missing_thumbnail.exception'
import { UnprocessableMediaException } from '#branch/exceptions/unprocessable_media.exception'
import Cell from '#cell/models/cell'
import ProcessFileJob from '#jobs/process_file_job'
import ProcessImageJob from '#jobs/process_image_job'
import ProcessVideoJob from '#jobs/process_video_job'
import Media from '#media/models/media'
import env from '#start/env'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import queue from '@rlanz/bull-queue/services/main'
import { InferInput } from '@vinejs/vine/types'
import { fileMetadata, uploadMediaValidator } from './validators.js'

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
  userId: number
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
  userId: number
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
  userId: number
}

export class UploadMediaService {
  async execute(
    data: InferInput<typeof uploadMediaValidator>,
    files: MultipartFile[],
    userId: number,
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
            userId,
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
            userId,
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
            userId,
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

  async #uploadImage({ file, metadata, title, branchId, spaceId, userId }: ImageProps) {
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

    queue.dispatch(ProcessImageJob, {
      spaceId,
      branchId,
      originKey: originalKey,
      optimKey: optimKey,
      blurKey: blurKey,
      cellId: savedCell.id,
      userId,
    })

    return [savedCell.toJSON(), media.toJSON()]
  }

  async #uploadVideo({ file, branchId, spaceId, title, metadata, thumbnail, userId }: VideoProps) {
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

    queue.dispatch(ProcessVideoJob, {
      spaceId,
      branchId,
      thumbnailKey: thumbnailKey,
      blurKey: blurKey,
      cellId: savedCell.id,
      userId,
    })

    return [savedCell.toJSON(), media.toJSON()]
  }

  async #uploadFile({ file, branchId, title, metadata }: FileProps) {
    const originalKey = file.meta.fileKey

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
    media.width = 0
    media.height = 0
    media.fileSize = metadata.size
    media.mime = metadata.mime
    media.thumbnailUrl = ''
    media.duration = 0
    media.save()

    queue.dispatch(ProcessFileJob, {
      cellId: savedCell.id,
    })

    return [savedCell.toJSON(), media.toJSON()]
  }
}
