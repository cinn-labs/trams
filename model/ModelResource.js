//@flow
class ModelResource {
  GET: {name: string, path: string}
  POST: {name: string, path: string}
  PUT: {name: string, path: string}
  DELETE: {name: string, path: string}

  constructor(name, paths) {
    let {GET, POST, PUT, DELETE} = this.generatePaths(paths)
    this.GET = {name: 'show', path: GET}
    this.POST = {name: 'insert', path: POST}
    this.PUT = {name: 'update', path: PUT}
    this.DELETE = {name: 'delete', path: DELETE}
  }

  generatePaths(paths) {
    const isObject = typeof paths === 'object'
    let {GET, POST, PUT, DELETE} = isObject ? paths : {}

    if (!isObject) {
      GET = paths + '/:id'
      POST = paths
      PUT = GET
      DELETE = PUT
    }

    return {GET, POST, PUT, DELETE}
  }
}

export default ModelResource
