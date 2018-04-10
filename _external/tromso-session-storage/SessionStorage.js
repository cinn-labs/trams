//@flow
import AuthStorage from '../../auth/AuthStorage'
import AuthUser from '../../auth/AuthUser'

const key = '##LU##'

class SessionStorage extends AuthStorage {
  restoreSession(): ?AuthUser {
    return JSON.parse(localStorage.getItem(key))
  }
  storeSession(user: AuthUser) {
    localStorage.setItem(key, JSON.stringify(user))
  }
  clearSession() {
    localStorage.removeItem(key)
  }
}

export default SessionStorage
