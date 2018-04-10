//@flow
import AuthUser from './AuthUser'

class AuthStorage {
  // To overrite by child class
  restoreSession(): ?AuthUser {}
  storeSession(user: AuthUser) {}
  clearSession() {}
}

export default AuthStorage
