import gql from 'graphql-tag'

export default gql`
  mutation UpdateMark($input: updateMarkInput) {
    data: updateMark(input: $input) {
      mark {
        id
        value
        assignment {
          id
        }
        student {
          id
        }
      }
    }
  }
`
