import Media from '#media/models/media'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Media.createMany([
      {
        cellId: 1,
        resizedUrl: 'https://f003.backblazeb2.com/file/dumpiapp/xy03uzlb28oxratzozjqsp34.jpg',
        width: 735,
        height: 1209,
        fileSize: 202637,
        mime: 'image/jpeg',
      },
      {
        cellId: 2,
        resizedUrl: 'https://f003.backblazeb2.com/file/dumpiapp/hxshnr8dsyw4szzym6tevs4i.jpg',
        width: 736,
        height: 1036,
        fileSize: 102610,
        mime: 'image/jpeg',
      },

      {
        cellId: 4,
        resizedUrl: 'https://f003.backblazeb2.com/file/dumpiapp/xy03uzlb28oxratzozjqsp34.jpg',
        width: 735,
        height: 1209,
        fileSize: 202637,
        mime: 'image/jpeg',
      },
      {
        cellId: 5,
        resizedUrl: 'https://f003.backblazeb2.com/file/dumpiapp/hxshnr8dsyw4szzym6tevs4i.jpg',
        width: 736,
        height: 1036,
        fileSize: 102610,
        mime: 'image/jpeg',
      },

      {
        cellId: 7,
        resizedUrl: 'https://f003.backblazeb2.com/file/dumpiapp/xy03uzlb28oxratzozjqsp34.jpg',
        width: 735,
        height: 1209,
        fileSize: 202637,
        mime: 'image/jpeg',
      },
      {
        cellId: 8,
        resizedUrl: 'https://f003.backblazeb2.com/file/dumpiapp/hxshnr8dsyw4szzym6tevs4i.jpg',
        width: 736,
        height: 1036,
        fileSize: 102610,
        mime: 'image/jpeg',
      },
    ])
  }
}
