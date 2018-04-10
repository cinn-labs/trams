//@flow
class FormField {
  name: stirng
  value: any
  errors: Array<string> = []

  constructor(name: string, value: any) {
    this.name = name
    this.value = value
  }

  addError(...errors: stirng) {
    this.errors = [...this.errors, ...errors]
  }

  cleanErrors() {
    this.errors = []
  }

  setValue(value: any) {
    this.value = value
  }

  hasErrors(): boolean {
    return !!this.errors.length
  }
}

export default FormField
