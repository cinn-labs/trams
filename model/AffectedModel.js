//@flow
import type {ModelClass} from './Model'

class AffectedModel {
  model: ModelClass
  pathToModel: string
  behavior: UpdateCacheBehavior = 'auto'

  constructor(model, pathToModel, behavior) {
    this.model = model
    this.pathToModel = pathToModel
    this.behavior = behavior || this.behavior
  }
}

export default AffectedModel
