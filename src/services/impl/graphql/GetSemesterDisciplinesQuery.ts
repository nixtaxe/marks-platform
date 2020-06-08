import gql from 'graphql-tag'

export default gql`
  query GetSemesterDisciplines {
    data: semesterDisciplines {
      id
      semesterDates {
        startDate
      }
      teacher_discipline_student_group {
        student_group {
          id
          name
        }
        academic_discipline {
          id
          name
        }
        teacher {
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
