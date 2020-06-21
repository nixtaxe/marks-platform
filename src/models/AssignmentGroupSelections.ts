import MarksConstraint from './MarksConstraint'
import IntegrationType from './IntegrationType'
import AssignmentGroup from './AssignmentGroup'

export default interface AssignmentGroupSelections {
  assignment_groups: AssignmentGroup[]
  integrationTypes: IntegrationType[]
  marksConstraints: MarksConstraint[]
}
