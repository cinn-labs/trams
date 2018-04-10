import React from 'react'

class QueryConnector extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      JSON.stringify(nextProps.urlParams) !== JSON.stringify(this.props.urlParams) ||
      JSON.stringify(nextProps.queryParams) !== JSON.stringify(this.props.queryParams)
    )
  }

  renderSubLevelComponent() {
    const {
      tromso,
      modelClass,
      queryName,
      urlParams,
      queryParams,
      freeze,
      Loading,
      Error,
      Success,
      render,
      ...restWrapperProps
    } = this.props

    const SubLevelComponent = tromso.viewConnector.connectQuery(
      props => {
        const totalProps = {...restWrapperProps, ...props}
        if (!Success) return render(totalProps)
        if (props.loading) return !!Loading ? <Loading {...totalProps} /> : <div>loading</div>
        if (props.error) return !!Error ? <Error {...totalProps} /> : <div>error</div>
        return <Success {...totalProps} />
      },
      modelClass,
      queryName,
    )

    return <SubLevelComponent urlParams={urlParams} queryParams={queryParams} freeze={freeze} />
  }

  render() {
    return this.renderSubLevelComponent()
  }
}

export default QueryConnector
