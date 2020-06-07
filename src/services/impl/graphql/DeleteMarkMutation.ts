import gql from 'graphql-tag'

export default gql`
  mutation DeleteMark($input: deleteMarkInput) {
    data: deleteMark(input: $input) {
      mark {
        id
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
