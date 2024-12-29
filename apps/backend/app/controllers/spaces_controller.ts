import { ownSpace } from '#abilities/main'
import Branch from '#models/branch'
import Cell from '#models/cell'
import Media from '#models/media'
import Space from '#models/space'
import { createSpace, fileMetadata, uploadToSpace } from '#validators/space'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'

export default class SpaceController {
  async create({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createSpace)
    const user = await auth.authenticate()

    const space = new Space()
    space.owner_id = user.id
    space.name = data.name
    const createdSpace = await space.save()

    const branch = new Branch()
    branch.space_id = createdSpace.id
    branch.name = 'root'
    await branch.save()

    return response.ok(true)
  }

  async upload({ bouncer, request, response }: HttpContext) {
    const upload = await request.validateUsing(uploadToSpace)

    const metadatas = upload.filesMetadata.map((metadata) =>
      fileMetadata.validate(JSON.parse(metadata))
    )
    const filesMetadata = await Promise.all(metadatas)
    const medias = []

    const branch = await Branch.findByOrFail('id', upload.branchId)
    const isOwner = await bouncer.allows(ownSpace, branch)
    if (!isOwner) {
      return response.forbidden('You cannot upload a file to this branch')
    }

    for (let i = 0; i < upload.files.length; ++i) {
      const key = `${cuid()}.${upload.files[i].extname}`
      await upload.files[i].moveToDisk(key, 's3')

      const c = {
        branch_id: Number.parseInt(upload.branchId),
        type: filesMetadata[i].mime,
      }
      const cell = await Cell.create(c)
      const jCell = cell.toJSON()

      const m = {
        cell_id: cell.id,
        url: await drive.use().getUrl(key),
        width: filesMetadata[i].width,
        height: filesMetadata[i].height,
        file_size: filesMetadata[i].size,
        mime: filesMetadata[i].mime,
        blur_hash: '',
        thumbnail_url: '', // from S3
        duration: filesMetadata[i].duration,
      }
      const media = await Media.create(m)
      medias.push({ ...jCell, media: media.toJSON() })
    }

    return response.ok(medias)
  }
}
