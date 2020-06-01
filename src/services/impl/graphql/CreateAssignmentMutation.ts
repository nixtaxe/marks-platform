import gql from 'graphql-tag'

export default gql`
  mutation CreateAssignment($input: createAssignmentInput!) {
    data: createAssignment(input: $input) {
      assignment {
        id
        title
        deadlineDate
        assignment_group {
          name
        }
      }
    }
  }
`
