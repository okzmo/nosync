import Media from '#media/models/media'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Media.createMany([
      {
        cell_id: 1,
        url: 'https://f003.backblazeb2.com/file/dumpiapp/xy03uzlb28oxratzozjqsp34.jpg',
        width: 735,
        height: 1209,
        file_size: 202637,
        mime: 'image/jpeg',
        blur_hash: 'LJEoMS01kDxu~V9GNbozNH$%R+Nb',
      },
      {
        cell_id: 2,
        url: 'https://f003.backblazeb2.com/file/dumpiapp/hxshnr8dsyw4szzym6tevs4i.jpg',
        width: 736,
        height: 1036,
        file_size: 102610,
        mime: 'image/jpeg',
        blur_hash: 'L55FOaW:4Tr@u6R*VX%2NFo~r=R4',
      },

      {
        cell_id: 4,
        url: 'https://f003.backblazeb2.com/file/dumpiapp/xy03uzlb28oxratzozjqsp34.jpg',
        width: 735,
        height: 1209,
        file_size: 202637,
        mime: 'image/jpeg',
        blur_hash: 'LJEoMS01kDxu~V9GNbozNH$%R+Nb',
      },
      {
        cell_id: 5,
        url: 'https://f003.backblazeb2.com/file/dumpiapp/hxshnr8dsyw4szzym6tevs4i.jpg',
        width: 736,
        height: 1036,
        file_size: 102610,
        mime: 'image/jpeg',
        blur_hash: 'L55FOaW:4Tr@u6R*VX%2NFo~r=R4',
      },

      {
        cell_id: 7,
        url: 'https://f003.backblazeb2.com/file/dumpiapp/xy03uzlb28oxratzozjqsp34.jpg',
        width: 735,
        height: 1209,
        file_size: 202637,
        mime: 'image/jpeg',
        blur_hash: 'LJEoMS01kDxu~V9GNbozNH$%R+Nb',
      },
      {
        cell_id: 8,
        url: 'https://f003.backblazeb2.com/file/dumpiapp/hxshnr8dsyw4szzym6tevs4i.jpg',
        width: 736,
        height: 1036,
        file_size: 102610,
        mime: 'image/jpeg',
        blur_hash: 'L55FOaW:4Tr@u6R*VX%2NFo~r=R4',
      },
    ])
  }
}
