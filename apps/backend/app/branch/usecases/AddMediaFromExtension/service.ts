import { addMediaFromExtensionValidator } from './validators.js'
import { InferInput } from '@vinejs/vine/types'

export class AddMediaFromExtensionService {
  async execute(data: InferInput<typeof addMediaFromExtensionValidator>) {}
}
