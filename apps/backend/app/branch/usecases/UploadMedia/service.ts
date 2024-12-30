import Cell from '#cell/models/cell'
import Media from '#media/models/media'
import { cuid } from '@adonisjs/core/helpers'
import { MultipartFile } from '@adonisjs/core/types/bodyparser'
import drive from '@adonisjs/drive/services/main'
import { fileMetadata } from './validators.js'

export class UploadMediaService {
  async execute(data: { branchId: string; files: MultipartFile[]; filesMetadata: string[] }) {
    const { branchId, files, filesMetadata } = data
    const medias = []

    // validate the metadatas for each file
    const validMetadatas = filesMetadata.map((metadata) =>
      fileMetadata.validate(JSON.parse(metadata))
    )
    const metadatas = await Promise.all(validMetadatas)

    // create a cell and a media object in DB for each file
    for (const [i, file] of files.entries()) {
      const key = `${cuid()}.${file.extname}`
      await file.moveToDisk(key, 's3')

      const tags = await this.#tagImage(await drive.use().getUrl(key))
      console.log(tags)

      const cell = new Cell()
      cell.branch_id = Number.parseInt(branchId)
      cell.type = metadatas[i].mime
      const savedCell = await cell.save()

      const media = new Media()
      media.cell_id = savedCell.id
      media.url = await drive.use().getUrl(key)
      media.width = metadatas[i].width
      media.height = metadatas[i].height
      media.file_size = metadatas[i].size
      media.mime = metadatas[i].mime
      media.blur_hash = ''
      media.thumbnail_url = '' // from S3
      media.duration = metadatas[i].duration
      media.save()

      medias.push({ ...savedCell.toJSON(), media: media.toJSON() })
    }

    return medias
  }

  async #tagImage(url: string) {}
}
