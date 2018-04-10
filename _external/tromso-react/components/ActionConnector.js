import React from 'react'

const ActionConnector = wrapperProps => {
  const {
    tromso,
    modelClass,
    queryName,
    urlParams,
    bodyParams,
    queryParams,
    Component,
    render,
    ...restWrapperProps
  } = wrapperProps

  const Main = tromso.viewConnector.connectAction(
    props => {
      return !!Component ? <Component {...restWrapperProps} {...props} /> : render({...restWrapperProps, ...props})
    },
    modelClass,
    queryName,
  )

  return <Main urlParams={urlParams} queryParams={queryParams} bodyParams={bodyParams} />
}

export default ActionConnector
