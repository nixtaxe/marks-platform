import { container } from 'inversify-props'
import IUserService from '@/services/IUserService'
import IMarksService from '@/services/IMarksService'
import FakeUserService from '@/mock/services/UserService'
import FakeMarksService from '@/mock/services/MarksService'

export default function buildDependencyContainer (): void {
  container.addTransient<IUserService>(FakeUserService, 'UserService')
  container.addTransient<IMarksService>(FakeMarksService, 'MarksService')
}
