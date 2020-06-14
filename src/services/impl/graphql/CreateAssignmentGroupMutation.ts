import gql from 'graphql-tag'

export default gql`
  mutation CreateAssignmentGroup($input: createAssignmentGroupInput!) {
    data: createAssignmentGroup(input: $input) {
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
