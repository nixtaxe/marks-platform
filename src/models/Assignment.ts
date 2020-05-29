import AssignmentGroup from './AssignmentGroup'
import Mark from '@/models/Mark'
import ID from './ID'

export default interface Assignment {
  id: ID
  title: string
  task: string
  deadlineDate: string
  marks: Mark[]
  assignment_group: AssignmentGroup
}
