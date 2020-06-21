import gql from 'graphql-tag'

export default gql`
  query GetSemesterDisciplinePrecentagesQuery($id: ID!) {
    data: semesterDiscipline(id: $id) {
      assignment_groups {
        percentage
      }
    }
  }
`
