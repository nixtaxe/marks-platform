import Assignment from '@/models/Assignment'
import ID from '@/models/ID'
import AssignmentGroup from '@/models/AssignmentGroup'
import AssignmentSelections from '@/models/AssignmentSelections'
import SemesterDiscipline from '@/models/SemesterDiscipline'
import AssignmentGroupSelections from '@/models/AssignmentGroupSelections'

export default interface IAssignmentService {
  getSemesterDisciplinePercentages(id: ID): Promise<SemesterDiscipline>
  getAssignment(id: ID): Promise<Assignment>
  getAssignmentSelections(
    semesterDisciplineId: ID
  ): Promise<AssignmentSelections>
  createAssignment(assignment: Assignment): Promise<Assignment>
  updateAssignment(assignment: Assignment): Promise<Assignment>
  deleteAssignment(id: ID): Promise<Assignment>

  getAssignmentGroups(semesterDisciplineId: ID): Promise<AssignmentGroup[]>
  getAssignmentGroup(id: ID): Promise<AssignmentGroup>
  getAssignmentGroupSelections(
    semesterDisciplineId: ID
  ): Promise<AssignmentGroupSelections>
  createAssignmentGroup(
    assignmentGroup: AssignmentGroup
  ): Promise<AssignmentGroup>
  updateAssignmentGroup(
    assignmentGroup: AssignmentGroup
  ): Promise<AssignmentGroup>
  deleteAssignmentGroup(id: ID): Promise<AssignmentGroup>
  refreshImport(assignmentGroupId: ID): Promise<any>
}
