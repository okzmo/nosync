import Cell from '#cell/models/cell'
import drive from '@adonisjs/drive/services/main'

export class DeleteCellService {
  async execute(id: string) {
    const cellToDel = await Cell.query().where('id', id).preload('media').first()

    if (
      cellToDel?.type.includes('image') ||
      cellToDel?.type.includes('video') ||
      cellToDel?.type === 'application/pdf'
    ) {
      const originalKey = cellToDel.media.originalUrl.split('/').at(-1)
      drive.use('s3').deleteAll(originalKey?.split('.')[0])
    }

    await cellToDel?.delete()
  }
}
