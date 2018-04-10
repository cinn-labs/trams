// @flow
import Model from '../model/Model'
import Query from '../query/Query'

class CacheItem {
  queryString: string
  query: Query
  data: Model
  storedAt: date = new Date()
	active: bool = true

  constructor(query) {
    this.query = query
    this.queryString = query.finalPath()
  }

  setData(data: Model) {
    this.data = data
  }

	deactivate() {
		this.active = false
	}

	isValid(): bool {
		// TODO: Check storedAt date
		return this.active && !!this.data
	}
}

export default CacheItem
