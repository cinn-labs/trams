//@flow
import type {DataType} from '../enums'
import Query from './Query'
import QueryParams from './QueryParams'

class QueryDefinition {
  name: string
  path: string
  method: QueryMethod = 'GET'
  responseDataType: DataType = 'single'
  needsAuth: boolean = false

  constructor(name: string, path: string, method: ?QueryMethod, needsAuth: ?boolean, responseDataType: ?DataType) {
    this.name = name
    this.path = path
    if (!!method) this.method = method
    if (!!responseDataType) this.responseDataType = responseDataType
    if (!!needsAuth) this.needsAuth = needsAuth
  }

  static GET(name: string, path: string, responseDataType: ?DataType) {
    return new QueryDefinition(name, path, 'GET', false, responseDataType)
  }

  static POST(name: string, path: string, responseDataType: ?DataType) {
    return new QueryDefinition(name, path, 'POST', false, responseDataType)
  }

  static PUT(name: string, path: string, responseDataType: ?DataType) {
    return new QueryDefinition(name, path, 'PUT', false, responseDataType)
  }

  static DESTROY(name: string, path: string, responseDataType: ?DataType) {
    return new QueryDefinition(name, path, 'DESTROY', false, responseDataType)
  }

  static AuthGET(name: string, path: string, responseDataType: ?DataType) {
    return new QueryDefinition(name, path, 'GET', true, responseDataType)
  }

  static AuthPOST(name: string, path: string, responseDataType: ?DataType) {
    return new QueryDefinition(name, path, 'POST', true, responseDataType)
  }

  static AuthPUT(name: string, path: string, responseDataType: ?DataType) {
    return new QueryDefinition(name, path, 'PUT', true, responseDataType)
  }

  static AuthDESTROY(name: string, path: string, responseDataType: ?DataType) {
    return new QueryDefinition(name, path, 'DESTROY', true, responseDataType)
  }

  initQuery(params: ?QueryParams, auth: ?AuthProvider): Query {
    if (!params) {
      params = new QueryParams()
    }
    if (this.needsAuth && !!auth) {
      params.headers = {...params.headers, ...auth.generateAuthHeaders()}
    }
    return new Query(this, params)
  }
}

export default QueryDefinition
