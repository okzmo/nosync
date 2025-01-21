import Cell from '#cell/models/cell'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Cell.createMany([
      {
        branchId: 1,
        title: 'Knight',
        type: 'image/jpeg',
        tags: 'knight, armor, cat, flowers, landscape, sunset, nature, fantasy, medieval, pet, serene, peaceful, portrait, greenery, mountains, sky, soft',
      },
      {
        branchId: 1,
        title: 'Jinx',
        type: 'image/jpeg',
        tags: 'portrait, woman, blue, hair, profile, fantasy, art, character, emotion, dark, tattoo, braid, beauty, expression, digital, illustration, dramatic, lighting, side, aesthetic, fierce, mystical, ethereal, striking, vivid, serene, detailed, captivating, unique, stylish, intense, shadow',
      },
      {
        branchId: 1,
        title: 'note',
        type: 'note',
      },
      {
        branchId: 2,
        title: 'Knight',
        type: 'image/jpeg',
        tags: 'knight, armor, cat, flowers, landscape, sunset, nature, fantasy, medieval, pet, serene, peaceful, portrait, greenery, mountains, sky, soft',
      },
      {
        branchId: 2,
        title: 'Jinx',
        type: 'image/jpeg',
        tags: 'portrait, woman, blue, hair, profile, fantasy, art, character, emotion, dark, tattoo, braid, beauty, expression, digital, illustration, dramatic, lighting, side, aesthetic, fierce, mystical, ethereal, striking, vivid, serene, detailed, captivating, unique, stylish, intense, shadow',
      },
      {
        branchId: 2,
        title: 'note',
        type: 'note',
      },
      {
        branchId: 3,
        title: 'Knight',
        type: 'image/jpeg',
        tags: 'knight, armor, cat, flowers, landscape, sunset, nature, fantasy, medieval, pet, serene, peaceful, portrait, greenery, mountains, sky, soft',
      },
      {
        branchId: 3,
        title: 'Jinx',
        type: 'image/jpeg',
        tags: 'portrait, woman, blue, hair, profile, fantasy, art, character, emotion, dark, tattoo, braid, beauty, expression, digital, illustration, dramatic, lighting, side, aesthetic, fierce, mystical, ethereal, striking, vivid, serene, detailed, captivating, unique, stylish, intense, shadow',
      },
      {
        branchId: 3,
        title: 'note',
        type: 'note',
      },
    ])
  }
}
