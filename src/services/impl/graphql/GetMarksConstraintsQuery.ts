import gql from 'graphql-tag'

export default gql`
  query GetMarksConstraintsQuery {
    data: marksConstraints {
      id
      name
    }
  }
`
