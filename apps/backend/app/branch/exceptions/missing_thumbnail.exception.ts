import { Exception } from '@adonisjs/core/exceptions'

export class MissingThumbnailException extends Exception {
  static message = 'The thumbnail failed to generate, please try again.'
  static code = 'E_MISSING_THUMBNAIL'
  static status = 400
}
