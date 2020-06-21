import gql from 'graphql-tag'

export default gql`
  query GetIntegrationTypesQuery {
    data: integrationTypes {
      id
      name
      code
    }
  }
`
