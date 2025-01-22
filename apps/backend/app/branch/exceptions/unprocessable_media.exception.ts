import { Exception } from '@adonisjs/core/exceptions'

export class UnprocessableMediaException extends Exception {
  static message = 'The given file is not yet supported by Brea.sh'
  static code = 'E_UNPROCESSABLE_MEDIA'
  static status = 422
}
