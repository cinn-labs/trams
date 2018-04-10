// @flow
import type {View} from '../view/ViewConnector'
import Model, {type ModelClass} from './Model'
import QueryExecutionOptions from '../query/QueryExecutionOptions'
import QueryParams from '../query/QueryParams'
import Tromso from '../Tromso'

class SuperModel {
  tromso: Tromso
  model: ModelClass

  constructor(tromso: Tromso, model: ModelClass) {
    this.tromso = tromso
    this.model = model
  }

  query(queryName: string, params: ?QueryParams, options: ?QueryExecutionOptions): Promise<Model> {
    return this.tromso.QueryBank.exec(this.model, queryName, params, options)
  }

  action(queryName: string, params: ?QueryParams, options: ?QueryExecutionOptions): Promise<Model> {
    return this.query(queryName, params, options)
  }

  connectAction(queryName: string, view: View, params: ?QueryParams): View {
    return this.tromso.viewConnector.connectAction(view, this.model, queryName, params)
  }

  connectQuery(queryName: string, view: View, params: ?QueryParams): View {
    return this.tromso.viewConnector.connectQuery(view, this.model, queryName, params)
  }
}

export default SuperModel
