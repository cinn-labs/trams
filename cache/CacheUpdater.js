//@flow
import AffectedModel from '../model/AffectedModel'
import CacheBank from './CacheBank'
import Model, {type ModelClass} from '../model/Model'

class CacheUpdater {
  static perform(model: ModelClass, affectedModel: AffectedModel, cacheBank: CacheBank, newData: Model) {
    // const isSameAsOriginalModel = affectedModel.model === model
    // TODO: Check type of affected model

    cacheBank.getByModelClass(affectedModel.model).forEach(cacheItem => {
      switch (affectedModel.behavior) {
        case 'auto':
          cacheItem.setData(model.fromQuery({...cacheItem.data, ...newData, id: cacheItem.data.id}))
          break

        case 'clear':
          cacheBank.deactivate(cacheItem.query)
          break
      }
    })
  }
}

export default CacheUpdater
