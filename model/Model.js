// @flow
import moment from 'moment'

import type {DataType} from '../enums'
import AffectedModel from './AffectedModel'
import ModelResource from './ModelResource'
import QueryParams from '../query/QueryParams'

class Model {
  static dataType: DataType = 'single'
  static resource: ModelResource
  static affectedModels: Array<AffectedModel> = []

  static getAffectedModels(): Model {
    console.error('Implementation missing for getAffectedModel on model subclass')
    return new Model()
  }

  static fromQuery(): Model {
    console.error('Implementation missing for fromQuery on model subclass')
    return new Model()
  }

  static toBodyParams(data): QueryParams {
    if (moment.isMoment(data)) return data.format()
    if (typeof data !== 'object') return data

    const finalData = Array.isArray(data) ? [] : {}

    for (let k in data) {
      if (!data.hasOwnProperty(k)) continue
      if (k === '_list') return this.toBodyParams(data[k])
      finalData[k] = this.toBodyParams(data[k])
    }

    return finalData
  }
}

export type ModelClass = any
export type ModelName = string

export default Model
