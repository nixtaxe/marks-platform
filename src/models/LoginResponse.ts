import User from './User'

export default interface LoginResponse {
  user: User
  jwt: string
}
