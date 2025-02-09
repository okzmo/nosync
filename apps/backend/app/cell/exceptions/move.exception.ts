import { Exception } from '@adonisjs/core/exceptions'

export class MoveException extends Exception {
  static message = 'Impossible to move the cell to the given branch.'
  static code = 'E_MOVE_CELL'
  static status = 400
}
