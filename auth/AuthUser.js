//@flow
import Model, {type ModelName} from '../model/Model'

class AuthUser extends Model {
  name: string
  authToken: string
  email: string
  pass: string

  static fromQuery(response): AuthUser {
    const m = new AuthUser()
    m.id = response.id
    m.name = response.name
    m.email = response.email
    m.authToken = response.authToken
    return m
  }
}

export default AuthUser
