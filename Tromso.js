//@flow
import type {ModelClass} from './model/Model'
import AuthProvider from './auth/AuthProvider'
import CacheBank from './cache/CacheBank'
import QueryBank from './query/QueryBank'
import StateBank from './state/StateBank'
import SuperModel from './model/SuperModel'
import ViewConnector from './view/ViewConnector'

class Tromso {
  queryBank: QueryBank
  cacheBank: CacheBank
  stateBank: StateBank
  authProvideor: AuthProvider
  viewConnector: ViewConnector

  constructor(queryBank: ?QueryBank, cacheBank: ?CacheBank, stateBank: ?StateBank) {
    this.queryBank = queryBank || new QueryBank()
    this.cacheBank = cacheBank || new CacheBank()
    this.stateBank = stateBank || new StateBank()
    this.queryBank.cache = this.cacheBank
  }

  setConnector(conn: ViewConnector) {
    this.viewConnector = conn
    this.viewConnector.queryBank = this.queryBank
    this.viewConnector.stateBank = this.stateBank
    this.cacheBank.viewConnector = conn
    this.stateBank.viewConnector = conn
  }

  setAuthProvider(auth: AuthProvider) {
    this.authProvider = auth
    this.queryBank.setAuthProvider(auth)
  }

  generateModelResource(model: ModelClass, paths: string | {}, needsAuth: book) {
    this.queryBank.generateModelResource(model, paths, needsAuth)
  }

  generateAuthModelResource(model: ModelClass, paths: string | {}) {
    this.queryBank.generateAuthModelResource(model, paths)
  }

	prepareSuperModel(model: ModelClass) {
		model.t = new SuperModel(this, model)
	}
}

export default Tromso
