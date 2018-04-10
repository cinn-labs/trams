import React from 'react'

// TODO: Check if it needs to block shouldUpdate like QueryConnector
const StateConnector = ({tromso, keys, Component, render}) => {
  const Main = tromso.viewConnector.connectState(props => {
    return !!Component ? <Component {...props} /> : render({...props})
  }, ...keys)

  return <Main />
}

export default StateConnector
