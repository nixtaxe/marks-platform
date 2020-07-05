import gql from 'graphql-tag'
export default gql`
  query GetUserQuery($id: ID!) {
    data: user(id: $id) {
      id
      name
      familyName
      patronymic
      username
      email
      role {
        name
      }
    }
  }
`
