import { Exception } from '@adonisjs/core/exceptions'

export class InvalidCellIdException extends Exception {
  static message = 'The given id is not a valid cell'
  static code = 'E_INVALID_CELL_ID'
  static status = 400
}
