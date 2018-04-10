//@flow
import React from 'react'

import type {ModelClass} from '../../model/Model'
import QueryParams from '../../query/QueryParams'
import ViewConnector from '../../view/ViewConnector'

class ReactConnector extends ViewConnector {
  connectState(WrappedComponent: React.Component, ...keys: string): React.Component {
    const self = this
    // It returns a component
    return class extends React.Component {
      constructor(props) {
        super(props)
      }

      render() {
        const data = self.stateBank.getValues(...keys)

        const changeState = self.stateBank.set.bind(self.stateBank)
        return (
          // that renders your component
          <WrappedComponent {...this.props} {...data} changeState={changeState} />
        )
      }

      componentDidMount() {
        // it remembers to subscribe to the store so it doesn't miss updates
        this.unsubscribe = self.subscribeEvent(this.handleChange.bind(this))
      }

      componentWillUnmount() {
        // and unsubscribe later
        this.unsubscribe()
      }

      handleChange() {
        // and whenever the store state changes, it re-renders.
        this.forceUpdate()
      }
    }
  }

  connectQuery(WrappedComponent: React.Component, modelClass: ModelClass, queryName: string): React.Component {
    const self = this
    // It returns a component
    return class extends React.Component {
      constructor(props) {
        super(props)
        this.state = {innerLoading: true, loading: true, data: undefined, error: undefined, success: undefined}
      }

      render() {
        return (
          // that renders your component
          <WrappedComponent {...this.props} {...this.state} />
        )
      }

      query(options) {
				const {untouchLoading} = options || {}

        const p = new QueryParams()
        p.urlParams = this.props.urlParams || p.urlParams
        p.queryParams = this.props.queryParams || p.queryParams

				const initState = {innerLoading: true}
				if(!untouchLoading) {
					initState.loading = true
				}
				this.setState(initState)

        self.queryBank
          .exec(modelClass, queryName, p)
          .then(data => this.setState({loading: false, innerLoading: false, success: true, data}))
          .catch(error => this.setState({loading: false, innerLoading: false, error}))
      }

      componentDidMount() {
        // it remembers to subscribe to the store so it doesn't miss updates
        this.unsubscribe = self.subscribeEvent(this.handleChange.bind(this))
        this.query()
      }

      componentWillReceiveProps() {
				// TODO: Check if urlParams and queryParams changed
				this.query({untouchLoading: true})
        this.forceUpdate()
      }

      componentWillUnmount() {
        // and unsubscribe later
        this.unsubscribe()
      }

      handleChange() {
        // and whenever the store state changes, it re-renders.
				this.query({untouchLoading: true})
        this.forceUpdate()
      }
    }
  }

  connectAction(WrappedComponent: React.Component, modelClass: ModelClass, queryName: string): React.Component {
    const self = this
    // It returns a component
    return class extends React.Component {
      constructor(props) {
        super(props)
        this.state = {loading: false, data: undefined, error: undefined}
      }

      render() {
        return (
          // that renders your component
          <WrappedComponent {...this.props} {...this.state} action={this.perform.bind(this)} />
        )
      }

      perform(bodyParams, urlParams, queryParams) {
        const p = new QueryParams()
        p.urlParams = urlParams || this.props.urlParams || p.urlParams
        p.queryParams = queryParams || this.props.queryParams || p.queryParams
        p.bodyParams = bodyParams || this.props.bodyParams || p.bodyParams

        this.setState({loading: true})

        self.queryBank
          .exec(modelClass, queryName, p)
          .then(data => this.setState({loading: false, data}))
          .catch(error => this.setState({loading: false, error}))
      }
    }
  }
}

export default ReactConnector
