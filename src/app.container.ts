import { container } from 'inversify-props'
import IUserService from '@/services/IUserService'
import IMarksService from '@/services/IMarksService'
// import MarksService from '@/mock/services/MarksService'
import IAssignmentService from '@/services/IAssignmentService'
// import UserService from '@/mock/services/UserService'
import MarksService from '@/services/impl/MarksService'
import UserService from '@/services/impl/UserService'
import AssignmentService from '@/services/impl/AssignmentService'

export default function buildDependencyContainer (): void {
  container.addTransient<IUserService>(UserService, 'UserService')
  container.addTransient<IMarksService>(MarksService, 'MarksService')
  container.addTransient<IAssignmentService>(
    AssignmentService,
    'AssignmentService',
  )
}
