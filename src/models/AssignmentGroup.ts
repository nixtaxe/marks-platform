import Assignment from '@/models/Assignment'
import SemesterDiscipline from '@/models/SemesterDiscipline'
import ID from './ID'
import IntegrationType from './IntegrationType'
import MarksConstraint from './MarksConstraint'

export default interface AssignmentGroup {
  id: ID
  name: string
  percentage: number
  integration_type: IntegrationType
  default_marks_constraint: MarksConstraint
  type: string
  parent_group: AssignmentGroup
  child_groups: AssignmentGroup[]
  assignments: Assignment[]
  semester_discipline: SemesterDiscipline
}
