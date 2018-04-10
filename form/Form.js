//@flow
import moment from 'moment'

import {hasArrayNotationOn, objResult, splitPath, splitPathWithArrayNotation} from '../helpers'
import FormField from './FormField'

class Form {
  fields: {[string]: FormField} = {}
  submit: (data: {[string]: any}) => Promise<Object>
  validate: (data: {[string]: any}) => Promise<Object> = () => {}
  refresh: () => {} = () => {}

  constructor(submit, validate, refresh) {
    if (!!submit) this.submit = submit
    if (!!validate) this.validate = validate
    if (!!refresh) this.refresh = refresh

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  copyData(data: object, prefix: string = '') {
    for (var key in data) {
      const value = data[key]

      if (!!value && value.constructor === Array) {
        // TODO: Refactor
        value.forEach((subValue, index) => {
          this.copyData(subValue, prefix + key + '[' + index + ']')
        })
      } else if (typeof value === 'object' && !moment.isMoment(value)) {
        this.copyData(value, prefix + key + '.')
      } else {
        // console.log('settingsvalue', prefix + key, value)
        this.setValue(prefix + key, value)
      }
    }
    // console.log('CP', data, this.fields)
  }

  addField(field: FormField) {
    this.fields[field.name] = field
  }

  getField(name: string): ?FormField {
    return this.fields[name]
  }

  getValue(name: string): ?any {
    const field = this.fields[name]
    if (!!field) {
      return field.value
    } else {
      // Get incomplete value if exists
      const key = Object.keys(this.fields).find(k => k.startsWith(name))

      if (!!key) {
        return objResult(this.toObject(), name)
      }
    }
  }

  getOrCreateField(name: string): FormField {
    let field = this.getField(name)
    if (!field) {
      field = new FormField(name)
      this.addField(field)
    }
    return field
  }

  addError(name: string, ...errors: string) {
    const field = this.getOrCreateField(name)
    field.addError(...errors)
  }

  cleanFieldErrors(name: string) {
    const field = this.getField(name)
    if (!!field) {
      field.cleanErrors()
    }
  }

  cleanAllErrors() {
    Object.keys(this.fields).forEach(name => this.cleanFieldErrors(name))
  }

  setValue(name: string, value: any) {
    const field = this.getOrCreateField(name)
    field.setValue(value)
    this.refresh()
  }

  removeFields(name: string) {
    Object.keys(this.fields).forEach(k => k.startsWith(name) && delete this.fields[k])
    this.refresh()
  }

  toObject(): {[string]: any} {
    const data = {}
    Object.keys(this.fields).forEach(name => {
      const value = this.getValue(name)
      const splitNames = splitPath(name)

      const splitNamesWithArrayNotation = splitPathWithArrayNotation(name)
      let nextIndex = 0

      const setValues = (parentNode, paths) => {
        nextIndex++
        const isLast = paths.length === 1
        const [currentName, ...restPaths] = paths

        if (!isLast) {
          if (!parentNode[currentName]) {
            const isArray = hasArrayNotationOn(splitNamesWithArrayNotation, nextIndex)
            parentNode[currentName] = isArray ? [] : {}
          }
          setValues(parentNode[currentName], restPaths)
        } else {
          parentNode[currentName] = value
        }
      }

      setValues(data, splitNames)
    })

    return data
  }

  hasAnyErrors(): boolean {
    let hasError = false
    Object.keys(this.fields).forEach(name => {
      const field = this.getField(name)
      console.log(field.hasErrors())
      if (!!field && field.hasErrors()) {
        hasError = true
        return
      }
    })
    return hasError
  }

  handleValidate(): Promise {
    return new Promise((resolve, reject) => {
      const data = this.toObject()
      this.validate(data, this)
      const invalid = this.hasAnyErrors()
      console.log(this, invalid)
      invalid ? reject() : resolve()
    })
  }

  handleSubmit(e): Primise<Object> {
    e.preventDefault()
    this.cleanAllErrors()
    return new Promise((resolve, reject) => {
      this.handleValidate()
        .then(() => {
          const data = this.toObject()
          console.log('s')
          this.refresh()
          Promise.resolve(this.submit(data))
        })
        .catch(() => {
          console.log('r')
          reject(this)
          this.refresh()
        })
    })
  }
}

export default Form
