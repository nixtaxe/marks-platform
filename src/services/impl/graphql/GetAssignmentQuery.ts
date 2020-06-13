import gql from 'graphql-tag'

export default gql`
  query GetAssignment($id: ID!) {
    data: assignment(id: $id) {
      id
      title
      deadlineDate
      assignment_group {
        id
        name
      }
    }
  }
`
