import gql from 'graphql-tag'

export default gql`
  mutation DeleteAssignmentGroup($input: deleteAssignmentGroupInput!) {
    data: deleteAssignmentGroup(input: $input) {
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
