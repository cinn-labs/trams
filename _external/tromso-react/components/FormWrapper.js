import React from 'react'

import Form from '../../../form/Form'

const DefaultForm = props => <form {...props} />

class FormWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.form = new Form(props.onSubmit, props.onValidate, this.handleChange.bind(this))
    if (!!props.initialData) {
      this.form.copyData(props.initialData)
    }
  }

  handleChange() {
    this.forceUpdate()
  }

  render() {
    const Component = this.props.Form || DefaultForm
    return (
      <Component onSubmit={this.form.handleSubmit} form={this.form}>
        {this.props.render(this.form)}
      </Component>
    )
  }
}

export default FormWrapper
