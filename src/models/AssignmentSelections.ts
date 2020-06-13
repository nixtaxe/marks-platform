import MarksConstraint from './MarksConstraint'
import AssignmentGroup from './AssignmentGroup'

export default interface AssignmentSelections {
  assignmentGroups: AssignmentGroup[]
  marksConstraints: MarksConstraint[]
}
