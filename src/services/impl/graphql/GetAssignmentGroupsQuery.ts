import gql from 'graphql-tag'

export default gql`
  query GetAssignmentGroups($semesterDisciplineId: ID!) {
    data: assignmentGroups(
      where: { semester_discipline: $semesterDisciplineId }
    ) {
      id
      name
      parent_group {
        id
      }
      child_groups {
        id
      }
    }
  }
`
