import Assignment from '@/models/Assignment'
import ID from '@/models/ID'
import AssignmentGroup from '@/models/AssignmentGroup'
import AssignmentSelections from '@/models/AssignmentSelections'

export default interface IAssignmentService {
  getAssignment(id: ID): Promise<Assignment>
  getAssignmentSelections(
    semesterDisciplineId: ID
  ): Promise<AssignmentSelections>
  createAssignment(assignment: Assignment): Promise<Assignment>
  updateAssignment(assignment: Assignment): Promise<Assignment>
  deleteAssignment(id: ID): Promise<Assignment>

  getAssignmentGroups(semesterDisciplineId: ID): Promise<AssignmentGroup[]>
  getAssignmentGroup(id: ID): Promise<AssignmentGroup>
  createAssignmentGroup(
    assignmentGroup: AssignmentGroup
  ): Promise<AssignmentGroup>
  updateAssignmentGroup(
    assignmentGroup: AssignmentGroup
  ): Promise<AssignmentGroup>
  deleteAssignmentGroup(id: ID): Promise<AssignmentGroup>
}
