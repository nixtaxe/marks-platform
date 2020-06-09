import Assignment from '@/models/Assignment'
import SemesterDiscipline from '@/models/SemesterDiscipline'
import ID from './ID'

export default interface AssignmentGroup {
  id: ID
  name: string
  type: string
  parent_group: AssignmentGroup
  child_groups: AssignmentGroup[]
  assignments: Assignment[]
  semester_discipline: SemesterDiscipline
}
