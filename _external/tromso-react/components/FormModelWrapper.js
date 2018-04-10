import React from 'react'

import FormWrapper from './FormWrapper'
import QueryConnector from './QueryConnector'
import QueryParams from '../../../query/QueryParams'

const FormModelWrapper = ({render, onSuccess, ...props}) => {
  const {modelClass, tromso, urlParams, initialData} = props

  if (!modelClass.resource) {
    return 'No resource for model ' + modelClass.name
  }

  const onSubmit = data => {
    const submitName = !!data.id ? modelClass.resource.PUT.name : modelClass.resource.POST.name
    const p = new QueryParams()
    p.urlParams = urlParams
    p.bodyParams = {...modelClass.toBodyParams(data), id: undefined}
    return new Promise((resolve, reject) => {
      tromso.queryBank
        .exec(modelClass, submitName, p)
        .then(response => {
          if (onSuccess) onSuccess(response)
          resolve(response)
        })
        .catch(e => reject(e))
    })
  }

  const queryName = modelClass.resource.GET.name
  const renderForm = ({data}) => (
    <FormWrapper onSubmit={onSubmit} initialData={data} render={form => render(form, data)} />
  )

  if (!urlParams || !urlParams.id) {
    return renderForm({data: initialData || new modelClass()})
  }

  return <QueryConnector {...props} queryName={queryName} Success={renderForm} />
}

export default FormModelWrapper
