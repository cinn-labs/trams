import React from 'react'

const DefaultInput = props => <input {...props} />

const InputWrapper = ({Input, form, name, ...props}) => {
  const Component = Input || DefaultInput
  const field = form.getOrCreateField(name)

  return (
    <Component
      name={name}
      onChange={e => form.setValue(name, !!e && !!e.target ? e.target.value : e)}
      defaultValue={field.value}
      errors={field.errors}
      {...props}
    />
  )
}

export default InputWrapper
