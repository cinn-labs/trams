// @flow
import StateItem from './StateItem'
import ViewConnector from '../view/ViewConnector'

class StateBank {
  state: {[string]: StateItem} = {}
  viewConnector: ViewConnector

  get(key: string): ?StateItem {
    return this.state[key]
  }

  getOrCreate(key: string): ?StateItem {
    let item = this.get(key)
    if (!item) {
      item = new StateItem(key)
      this.state[key] = item
    }
    return item
  }

  set(key: string, value: any) {
    const item = this.getOrCreate(key)
    item.setValue(value)
    if (!!this.viewConnector) this.viewConnector.refresh()
  }

  getValues(...keys: string): {[string]: any} {
    const data = {}
    keys.forEach(key => (data[key] = this.getOrCreate(key).value))
    return data
  }

  setInitialState(data: {[string]: any}) {
    for (let key in data) {
      const item = this.get(key)
      if (!item || item.value === undefined || item.value === null) {
        this.set(key, data[key])
      }
    }
  }
}

export default StateBank
