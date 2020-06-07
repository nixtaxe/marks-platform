import gql from 'graphql-tag'

export default gql`
  mutation CreateMark($input: createMarkInput!) {
    data: createMark(input: $input) {
      mark {
        id
        value
        assignment {
          id
          title
        }
        student {
          id
          user {
            familyName
            name
            patronymic
          }
        }
      }
    }
  }
`
