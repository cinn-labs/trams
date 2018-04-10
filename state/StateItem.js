// @flow

class StateItem {
  key: string
  value: Model
  storedAt: date = new Date()

  constructor(key, value) {
    this.key = key
    this.value = value
  }

  setValue(value: any) {
    this.value = value
  }
}

export default StateItem
