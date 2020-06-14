import gql from 'graphql-tag'

export default gql`
  query GetAssignmentGroupQuery($id: ID!) {
    data: assignmentGroup(id: $id) {
      id
      name
      percentage
    }
  }
`