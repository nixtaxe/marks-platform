import gql from 'graphql-tag'

export default gql`
  query GetAssignment($id: ID!) {
    data: assignment(id: $id) {
      id
      title
      deadlineDate
      marks_constraint {
        id
        name
      }
      assignment_group {
        id
        name
      }
    }
  }
`
