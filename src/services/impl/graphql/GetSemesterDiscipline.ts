import gql from 'graphql-tag'
export default gql`
  query GetSemesterDiscipline($id: ID!) {
    data: semesterDiscipline(id: $id) {
      id
      teacher_discipline_student_group {
        teacher {
          user {
            familyName
            name
            patronymic
          }
        }
        academic_discipline {
          name
        }
        student_group {
          id
          name
          students {
            id
            user {
              familyName
              name
              patronymic
            }
          }
        }
      }
      assignment_groups {
        assignments {
          title
          marks {
            value
            student {
              user {
                familyName
                name
                patronymic
              }
            }
          }
        }
      }
    }
  }
`