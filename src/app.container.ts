import { container } from 'inversify-props'
import IUserService from '@/services/IUserService'
// import FakeUserService from '@/mock/services/UserService'
import UserService from '@/services/impl/UserService'

export default function buildDependencyContainer (): void {
  container.addTransient<IUserService>(UserService, 'UserService')
}
