import React from 'react'

class InputHidden extends React.Component {
  constructor(props) {
    super(props)
    props.form.setValue(props.name, props.value)
  }

  render() {
    return false
  }
}

export default InputHidden
