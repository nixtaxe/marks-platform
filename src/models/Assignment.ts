import AssignmentGroup from './AssignmentGroup'
import Mark from '@/models/Mark'
import ID from './ID'
import MarksConstraint from './MarksConstraint'

export default interface Assignment {
  id: ID
  title: string
  task: string
  deadlineDate: string
  marks: Mark[]
  marks_constraint: MarksConstraint
  assignment_group: AssignmentGroup
}
