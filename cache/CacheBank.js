// @flow
import AffectedModel from '../model/AffectedModel'
import CacheItem from './CacheItem'
import CacheUpdater from './CacheUpdater'
import Model, {type ModelClass} from '../model/Model'
import Query from '../query/Query'
import ViewConnector from '../view/ViewConnector'

class CacheBank {
  state: {[string]: CacheItem} = {}
  viewConnector: ViewConnector

  get(query: Query): CacheItem {
    const key = query.finalPath()
    let cacheItem = this.state[key]
    if (!cacheItem) {
      cacheItem = new CacheItem(query)
    }
    this.state[key] = cacheItem
    return cacheItem
  }

  getByModelClass(model: ModelClass): Array<CacheItems> {
    const cacheItems = []
    for (let queryStr in this.state) {
      const cacheItem = this.state[queryStr]
      if (typeof cacheItem.data === 'object' && !!model && cacheItem.data instanceof model) {
        cacheItems.push(cacheItem)
      }
    }
    return cacheItems
  }

  set(query: Query, data: Model) {
    const cacheItem = this.get(query)
    cacheItem.setData(data)
    this.viewConnector.refresh()
  }

  updateAffectedModels(model: ModelClass, data: Model) {
    const affectedModels = [
      new AffectedModel(model, ''),
      ...((model.getAffectedModels && model.getAffectedModels()) || []),
    ]

    affectedModels.forEach(affectedModel => {
      CacheUpdater.perform(model, affectedModel, this, data)
    })

    this.viewConnector.refresh()
  }

	deactivate(query: Query) {
    this.get(query).deactivate()
  }

  _remove(query: Query) {
    delete this.state[query.finalPath()]
  }
}

export default CacheBank
