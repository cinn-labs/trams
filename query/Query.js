//@flow
import 'whatwg-fetch'
import type {ModelClass} from '../models/Model'
import QueryDefinition from './QueryDefinition'
import QueryParams from './QueryParams'

class Query {
  params: QueryParams = new QueryParams()
  definition: QueryDefinition

  constructor(definition, params) {
    this.definition = definition
    this.params = params || new QueryParams()
  }

  finalPath(): string {
    let path = this.definition.path

    // URL params
    for (let key in this.params.urlParams) {
      const value = this.params.urlParams[key]
      const fullKey = `:${key}`
      path = path.replace(fullKey, value)
    }

    // Query params
    for (let key in this.params.queryParams) {
      const value = this.params.queryParams[key]
      let joint = '&'
      if (!path.includes('?')) {
        joint = '?'
      }
      path += `${joint}${key}=${value}`
    }

    return path
  }

  formatQueryParams(): Object {
    const method = this.definition.method
    const params = {
      method,
      headers: {...this.params.headers},
    }

    if (method === 'POST' || method === 'PUT') {
      params.body = JSON.stringify(this.params.bodyParams)
    }

    return params
  }

  exec(): Promise<Array | Object> {
    const path = this.finalPath()

    return new Promise((resolve, reject) => {
      fetch(path, this.formatQueryParams())
        .then(function(response) {
          if (response.ok === false) {
            reject(response)
            return
          }
          const json = response.json()
          resolve(json)
        })
        .catch(function(er) {
          // TODO: Check default interceptor
          reject(er)
        })
    })
  }
}

export default Query
