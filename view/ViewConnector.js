//@flow
import type {ModelClass} from '../model/Model'
import QueryBank from '../query/QueryBank'
import StateBank from '../state/StateBank'

export type View = any
export type SubscribeEvent = () => mixed
export type UnsubscribeEvent = () => {}

class ViewConnector {
  queryBank: QueryBank
  stateBank: StateBank
  subscribedChain: Array<SubscribeEvent> = []

  connectAction(view: View, modelClass: ModelClass, queryName: string): View {
    console.error('Missing implementation for connectAction on ViewConnect subclass')
    return view
  }

  connectQuery(view: View, modelClass: ModelClass, queryName: string): View {
    console.error('Missing implementation for connectQuery on ViewConnect subclass')
    return view
  }

  connectState(view: View, ...keys: string): View {
    console.error('Missing implementation for connectState on ViewConnect subclass')
    return view
  }

  subscribeEvent(e: SubscribeEvent): UnsubscribeEvent {
    this.subscribedChain.push(e)
    return () => {
      this.subscribedChain = this.subscribedChain.filter(i => i != e)
    }
  }

  refresh() {
    this.subscribedChain.forEach(e => e())
  }
}

export default ViewConnector
