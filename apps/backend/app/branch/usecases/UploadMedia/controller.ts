import { ownSpace } from '#abilities/main'
import Branch from '#branch/models/branch'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { UploadMediaService } from './service.js'
import { uploadMediaValidator } from './validators.js'

@inject()
export default class UploadMediaController {
  constructor(private uploadMedia: UploadMediaService) {}

  async handle({ bouncer, request, response, auth }: HttpContext) {
    const data = await request.validateUsing(uploadMediaValidator)

    const branch = await Branch.findByOrFail('id', data.branchId)
    if (await bouncer.denies(ownSpace, branch)) {
      return response.forbidden('You cannot upload a file to this branch')
    }

    const medias = await this.uploadMedia.execute(data)

    return response.ok(medias)
  }
}
