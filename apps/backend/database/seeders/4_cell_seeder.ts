import Cell from '#cell/models/cell'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Cell.createMany([
      {
        branch_id: 1,
        title: 'Knight',
        type: 'image/jpeg',
        tags: 'knight, armor, cat, flowers, landscape, sunset, nature, fantasy, medieval, pet, serene, peaceful, portrait, greenery, mountains, sky, soft',
      },
      {
        branch_id: 1,
        title: 'Jinx',
        type: 'image/jpeg',
        tags: 'portrait, woman, blue, hair, profile, fantasy, art, character, emotion, dark, tattoo, braid, beauty, expression, digital, illustration, dramatic, lighting, side, aesthetic, fierce, mystical, ethereal, striking, vivid, serene, detailed, captivating, unique, stylish, intense, shadow',
      },
      {
        branch_id: 1,
        title: 'note',
        type: 'note',
      },
      {
        branch_id: 2,
        title: 'Knight',
        type: 'image/jpeg',
        tags: 'knight, armor, cat, flowers, landscape, sunset, nature, fantasy, medieval, pet, serene, peaceful, portrait, greenery, mountains, sky, soft',
      },
      {
        branch_id: 2,
        title: 'Jinx',
        type: 'image/jpeg',
        tags: 'portrait, woman, blue, hair, profile, fantasy, art, character, emotion, dark, tattoo, braid, beauty, expression, digital, illustration, dramatic, lighting, side, aesthetic, fierce, mystical, ethereal, striking, vivid, serene, detailed, captivating, unique, stylish, intense, shadow',
      },
      {
        branch_id: 2,
        title: 'note',
        type: 'note',
      },
      {
        branch_id: 3,
        title: 'Knight',
        type: 'image/jpeg',
        tags: 'knight, armor, cat, flowers, landscape, sunset, nature, fantasy, medieval, pet, serene, peaceful, portrait, greenery, mountains, sky, soft',
      },
      {
        branch_id: 3,
        title: 'Jinx',
        type: 'image/jpeg',
        tags: 'portrait, woman, blue, hair, profile, fantasy, art, character, emotion, dark, tattoo, braid, beauty, expression, digital, illustration, dramatic, lighting, side, aesthetic, fierce, mystical, ethereal, striking, vivid, serene, detailed, captivating, unique, stylish, intense, shadow',
      },
      {
        branch_id: 3,
        title: 'note',
        type: 'note',
      },
    ])
  }
}
