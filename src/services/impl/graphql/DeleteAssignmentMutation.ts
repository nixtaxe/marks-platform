import gql from 'graphql-tag'

export default gql`
  mutation DeleteAssignment($input: deleteAssignmentInput!) {
    data: deleteAssignment(input: $input) {
      assignment {
        id
        title
        deadlineDate
        assignment_group {
          id
          name
        }
      }
    }
  }
`
