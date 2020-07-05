import gql from 'graphql-tag'
export default gql`
  mutation Login($username: String!, $password: String!) {
    data: login(input: { identifier: $username, password: $password }) {
      jwt
      user {
        id
        role {
          name
        }
      }
    }
  }
`
