// @flow
import Model, {type ModelClass} from '../model/Model'
import QueryDefinition from './QueryDefinition'

class QueryModel {
  model: ModelClass
  queryDefinitions: {[string]: QueryDefinition} = {}

  constructor(model) {
    this.model = model
  }

  resultToModel(response: Any): Model {
    return this.model.fromQuery(response)
  }

  getQueryDefinition(queryName: string): ?QueryDefinition {
    return this.queryDefinitions[queryName]
  }

  addQueryDefinition(definition: QueryDefinition) {
    this.queryDefinitions[definition.name] = definition
  }
}

export default QueryModel
