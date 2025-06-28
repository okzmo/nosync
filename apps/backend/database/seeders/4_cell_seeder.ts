import Cell from '#cell/models/cell'
import { cuid } from '@adonisjs/core/helpers'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Cell.createMany([
      {
        branchId: cuid(),
        title: 'Knight',
        type: 'image/jpeg',
        tags: 'knight, armor, cat, flowers, landscape, sunset, nature, fantasy, medieval, pet, serene, peaceful, portrait, greenery, mountains, sky, soft',
      },
      {
        branchId: cuid(),
        title: 'Jinx',
        type: 'image/jpeg',
        tags: 'portrait, woman, blue, hair, profile, fantasy, art, character, emotion, dark, tattoo, braid, beauty, expression, digital, illustration, dramatic, lighting, side, aesthetic, fierce, mystical, ethereal, striking, vivid, serene, detailed, captivating, unique, stylish, intense, shadow',
      },
      {
        branchId: cuid(),
        title: 'note',
        type: 'note',
      },
      {
        branchId: cuid(),
        title: 'Knight',
        type: 'image/jpeg',
        tags: 'knight, armor, cat, flowers, landscape, sunset, nature, fantasy, medieval, pet, serene, peaceful, portrait, greenery, mountains, sky, soft',
      },
      {
        branchId: cuid(),
        title: 'Jinx',
        type: 'image/jpeg',
        tags: 'portrait, woman, blue, hair, profile, fantasy, art, character, emotion, dark, tattoo, braid, beauty, expression, digital, illustration, dramatic, lighting, side, aesthetic, fierce, mystical, ethereal, striking, vivid, serene, detailed, captivating, unique, stylish, intense, shadow',
      },
      {
        branchId: cuid(),
        title: 'note',
        type: 'note',
      },
      {
        branchId: cuid(),
        title: 'Knight',
        type: 'image/jpeg',
        tags: 'knight, armor, cat, flowers, landscape, sunset, nature, fantasy, medieval, pet, serene, peaceful, portrait, greenery, mountains, sky, soft',
      },
      {
        branchId: cuid(),
        title: 'Jinx',
        type: 'image/jpeg',
        tags: 'portrait, woman, blue, hair, profile, fantasy, art, character, emotion, dark, tattoo, braid, beauty, expression, digital, illustration, dramatic, lighting, side, aesthetic, fierce, mystical, ethereal, striking, vivid, serene, detailed, captivating, unique, stylish, intense, shadow',
      },
      {
        branchId: cuid(),
        title: 'note',
        type: 'note',
      },
    ])
  }
}
