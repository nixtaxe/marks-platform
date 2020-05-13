import { container } from 'inversify-props'
import IUserService from '@/services/IUserService'
import FakeUserService from '@/mock/services/UserService'

export default function buildDependencyContainer (): void {
  container.addTransient<IUserService>(FakeUserService, 'UserService')
}
