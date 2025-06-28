import { ownBranch } from '#abilities/main'
import Branch from '#branch/models/branch'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { UploadMediaService } from './service.js'
import { uploadMediaValidator } from './validators.js'
import { Upload } from '@aws-sdk/lib-storage'
import client from '#services/s3_client'
import env from '#start/env'
import { cuid, isCuid } from '@adonisjs/core/helpers'
import { MultipartFile } from '@adonisjs/core/bodyparser'

@inject()
export default class UploadMediaController {
  constructor(private uploadMedia: UploadMediaService) { }

  async handle({ bouncer, request, response, auth }: HttpContext) {
    // stream files to s3
    request.multipart.onFile('*', { size: '1gb' }, async (part, reporter) => {
      part.pause()
      part.on('data', reporter)
      part.on('error', (err) => {
        console.log('ERROR:', err)
      })

      const defaultFileName = part.file.clientName.toLowerCase().trim().replaceAll(' ', '-')
      const fileKey = isCuid(defaultFileName) ? defaultFileName : `${cuid()}_${defaultFileName}`
      const upload = new Upload({
        client: client,
        params: {
          Bucket: env.get('S3_BUCKET'),
          Key: fileKey,
          Body: part,
          ContentType: part.headers['content-type'],
          // ContentDisposition: 'attachment',
          ChecksumAlgorithm: 'CRC32',
        },
        leavePartsOnError: false,
      })

      upload.on('httpUploadProgress', (progress) => {
        console.log(`Uploaded ${progress.loaded}`)
      })

      try {
        await upload.done()
        return { fileKey, status: 'completed' }
      } catch (error) {
        console.error('Upload failed:', error)
        upload.abort()
        request.multipart.abort(error)
      }
    })
    await request.multipart.process()

    const tmpFiles = request.allFiles().files
    const tmpThumbnails = request.allFiles().thumbnails
    let files: MultipartFile[] = Array.isArray(tmpFiles) ? tmpFiles : [tmpFiles]
    let thumbnails: MultipartFile[] = Array.isArray(tmpThumbnails) ? tmpThumbnails : [tmpThumbnails]

    const data = await request.validateUsing(uploadMediaValidator)
    const branch = await Branch.findByOrFail('id', data.branchId)
    if (await bouncer.denies(ownBranch, branch)) {
      return response.forbidden('You cannot upload a file to this branch')
    }

    const user = await auth.authenticate()
    const medias = await this.uploadMedia.execute(data, files, user.id, thumbnails)

    return response.ok(medias)
  }
}
