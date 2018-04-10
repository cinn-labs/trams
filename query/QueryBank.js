// @flow
import {getTromso} from '../../config/tromso'
import AuthProvider from '../auth/AuthProvider'
import AuthUser from '../auth/AuthUser'
import CacheBank from '../cache/CacheBank'
import Model, {type ModelClass, type ModelName} from '../model/Model'
import ModelResource from '../model/ModelResource'
import QueryDefinition from './QueryDefinition'
import QueryExecutionOptions from './QueryExecutionOptions'
import QueryModel from './QueryModel'
import QueryParams from './QueryParams'

class QueryBank {
  queryModels: {[ModelName]: QueryModel} = {}
  cache: CacheBank
  authProvider: AuthProvider
  mainPath: string = ''

  setMainPath(p: string) {
    this.mainPath = p
  }

  setAuthProvider(auth: AuthProvider) {
    this.addQueryDefinitions(
      AuthUser,
      QueryDefinition.POST('login', 'session'),
      QueryDefinition.AuthDESTROY('logout', 'session'),
    )
    this.authProvider = auth
    auth.queryBank = this
  }

  addQueryDefinitions(modelClass: ModelClass, ...definitions: QueryDefinition) {
    let queryModel = this.getQueryModel(modelClass)
    definitions.forEach(d => {
      d.path = this.mainPath + d.path
      queryModel.addQueryDefinition(d)
    })
  }

  generateModelResource(modelClass: ModelClass, paths: {} | string, needsAuth: boolean) {
    const resource = new ModelResource(modelClass.name, paths)
    modelClass.resource = resource

    const queries = []
    for (let method in resource) {
      if (!!resource[method]) {
        const {name, path} = resource[method]
        queries.push(new QueryDefinition(name, path, method, needsAuth))
      }
    }
    this.addQueryDefinitions(modelClass, ...queries)
  }

  generateAuthModelResource(modelClass: ModelClass, paths: {} | string) {
    this.generateModelResource(modelClass, paths, true)
  }

  getQueryModel(modelClass: ModelClass): QueryModel {
    let queryModel = this.queryModels[modelClass.name]
    if (!queryModel) {
      queryModel = new QueryModel(modelClass)
    }
    this.queryModels[modelClass.name] = queryModel
    return queryModel
  }

  exec(model: ModelClass, queryName: string, params: ?QueryParams, options: ?QueryExecutionOptions): Promise<Model> {
    const queryModel = this.getQueryModel(model)
    const queryDefinition = queryModel.getQueryDefinition(queryName)
    const query = queryDefinition.initQuery(params, this.authProvider)
    const isGet = queryDefinition.method === 'GET'

    return new Promise((resolve, reject) => {
      if (isGet) {
        const cacheItem = this.cache.get(query)

        if (cacheItem.isValid()) {
          resolve(cacheItem.data)
          return
        }
      }

      query
        .exec()
        .then(response => {
          const data = queryModel.resultToModel(response)
          if (isGet) {
            this.cache.set(query, data, options)
          } else {
            this.cache.updateAffectedModels(model, data)
          }
          resolve(data)
        })
        .catch(err => console.log('BANK ERR', err) || reject(err))
    })
  }
}

export default QueryBank
