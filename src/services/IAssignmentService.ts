import Assignment from '@/models/Assignment'
import ID from '@/models/ID'
import AssignmentGroup from '@/models/AssignmentGroup'

export default interface IAssignmentService {
  createAssignment(assignment: Assignment): Promise<Assignment>
  getAssignmentGroups(semesterDisciplineId: ID): Promise<AssignmentGroup[]>
}
