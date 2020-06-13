import gql from 'graphql-tag'

export default gql`
  mutation UpdateAssignment($input: updateAssignmentInput!) {
    data: updateAssignment(input: $input) {
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
