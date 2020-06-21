import gql from 'graphql-tag'

export default gql`
  query GetAssignmentGroupQuery($id: ID!) {
    data: assignmentGroup(id: $id) {
      id
      name
      percentage
      integration_type {
        id
        name
        code
      }
      integrationUrl
      sheetName
      upperLeftCell
      lowerRightCell
      default_marks_constraint {
        id
        name
      }
      semester_discipline {
        assignment_groups {
          percentage
        }
      }
    }
  }
`
