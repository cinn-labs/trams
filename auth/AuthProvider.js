//@flow
import AuthStorage from './AuthStorage'
import AuthUser from './AuthUser'
import Model, {type ModelClass} from '../model/Model'
import QueryBank from '../query/QueryBank'
import QueryParams from '../query/QueryParams'

class AuthProvider {
  checked: boolean
  logged: boolean
  authToken: string
  loggedUser: AuthUser
  userModelClass: ModelClass = AuthUser
  loginQueryName: string = 'login'
  logoutQueryName: string = 'logout'
  queryBank: QueryBank
  storage: AuthStorage = new AuthStorage()

  constructor(storage: AuthStorage) {
    this.storage = storage
  }

  static WithStorage(storage: AuthStorage) {
    return new AuthProvider(storage)
  }

  login(user: AuthUser): Promise<AuthUser> {
    return new Promise((resolve, reject) => {
      const p = new QueryParams()
      p.bodyParams = {email: user.email, pass: user.pass}
      this.queryBank
        .exec(this.userModelClass, this.loginQueryName, p)
        .then(user => {
          this.storeLoggedUser(user)
          resolve(user)
        })
        .catch(reject)
    })
  }

  logout(): Promise {
    return new Promise((resolve, reject) => {
      this.queryBank
        .exec(this.userModelClass, this.logoutQueryName)
        .then(r => {
          this.clearLoggedUser()
          resolve(r)
        })
        .catch(reject)
    })
  }

  storeLoggedUser(user: ?AuthUser) {
    if (!!user) {
      console.log(this)
      this.storage.storeSession(user)
      const {authToken, ...restUser} = user
      // TODO: define expiration
      this.checked = true
      this.authToken = authToken
      this.loggedUser = restUser
      this.logged = true
    }
  }

  clearLoggedUser() {
    this.storage.clearSession()
    this.loggedUser = undefined
    this.logged = false
    this.authToken = undefined
  }

  checkAndRestoreSession() {
    // TODO: Check expiration
    if (!this.checked) {
      const user = this.storage.restoreSession()
      this.storeLoggedUser(user)
    }
  }

  getLoggedUser(): Model {
    this.checkAndRestoreSession()
    return this.loggedUser
  }

  isLogged(): boolean {
    this.checkAndRestoreSession()
    return this.logged
  }

  getAuthToken(): ?string {
    this.checkAndRestoreSession()
    return this.authToken
  }

  generateAuthHeaders(): Object {
    const headers = {}
    const token = this.getAuthToken()
    if (token) {
      headers.Auth = `Bearer ${token}`
    }
    return headers
  }

  addCurrentUserIdOnUrlsParams(params: QueryParams) {
    if (this.isLogged()) {
      params.urlParams.loggedUserId = this.loggedUser
    }
  }
}

export default AuthProvider
