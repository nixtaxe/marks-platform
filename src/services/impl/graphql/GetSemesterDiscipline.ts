import gql from 'graphql-tag'
export default gql`
  query GetSemesterDiscipline($id: ID!) {
    data: semesterDiscipline(id: $id) {
      id
      marks_constraint {
        minValue
        maxValue
        satisfactory
        good
        excellent
      }
      semesterDates {
        startDate
      }
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
        id
        name
        percentage
        assignments {
          id
          title
          marks_constraint {
            id
            minValue
            maxValue
            satisfactory
            good
            excellent
          }
          marks {
            id
            value
            student {
              id
            }
            assignment {
              id
            }
          }
        }
      }
    }
  }
`
