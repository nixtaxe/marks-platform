import Assignment from '@/models/Assignment'
import ID from '@/models/ID'
import AssignmentGroup from '@/models/AssignmentGroup'

export default interface IAssignmentService {
  getAssignment(id: ID): Promise<Assignment>
  createAssignment(assignment: Assignment): Promise<Assignment>
  updateAssignment(assignment: Assignment): Promise<Assignment>
  deleteAssignment(id: ID): Promise<Assignment>
  getAssignmentGroups(semesterDisciplineId: ID): Promise<AssignmentGroup[]>
}
