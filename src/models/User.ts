import Role from './Role'

export default interface User {
  id: number
  name: string
  familyName: string
  patronymic: string
  username: string
  email: string
  role: Role
}
