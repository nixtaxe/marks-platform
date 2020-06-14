import gql from 'graphql-tag'

export default gql`
  mutation UpdateAssignmentGroup($input: updateAssignmentGroupInput!) {
    data: updateAssignmentGroup(input: $input) {
      assignmentGroup {
        id
        name
        percentage
        semester_discipline {
          id
        }
      }
    }
  }
`
