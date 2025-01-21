import sharp from 'sharp'

const RESIZED_SIZE = 600

export async function optimizeImage(
  file: Uint8Array<ArrayBufferLike>,
  width: number,
  height: number
) {
  const aspectRatio = width / height

  const optimizedImage = sharp(file).webp({ quality: 75 })

  let resizedImage: sharp.Sharp
  if (width > RESIZED_SIZE) {
    if (aspectRatio > 1) {
      resizedImage = optimizedImage.resize(RESIZED_SIZE)
    } else {
      resizedImage = optimizedImage.resize(RESIZED_SIZE)
    }
  }

  return optimizedImage.toBuffer()
}
