import Assignment from '@/models/Assignment'

export default interface IAssignmentService {
  createAssignment(assignment: Assignment): Promise<Assignment>
}
