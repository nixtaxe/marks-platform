import IAssignmentService from '@/services/IAssignmentService'
import Assignment from '@/models/Assignment'
import httpClient from '@/services/HttpClient'
import CreateAssignmentMutation from './graphql/CreateAssignmentMutation'
import CreateAssignmentInput from '@/models/CreateAssignmentInput'
import AssignmentGroup from '@/models/AssignmentGroup'
import ID from '@/models/ID'
import GetAssignmentGroupQuery from './graphql/GetAssignmentGroupsQuery'
import GetAssignmentQuery from './graphql/GetAssignmentQuery'
import UpdateAssignmentMutation from './graphql/UpdateAssignmentMutation'
import DeleteAssignmentMutation from './graphql/DeleteAssignmentMutation'
import MarksConstraint from '@/models/MarksConstraint'
import AssignmentSelections from '@/models/AssignmentSelections'
import GetMarksConstraintsQuery from './graphql/GetMarksConstraintsQuery'

export default class AssignmentService implements IAssignmentService {
  async getAssignment (id: ID): Promise<Assignment> {
    const result = await httpClient.query({
      query: GetAssignmentQuery,
      variables: { id },
      fetchPolicy: 'no-cache',
    })

    return result.data.data
  }

  async getAssignmentSelections (
    semesterDisciplineId: ID,
  ): Promise<AssignmentSelections> {
    const assignmentGroups = await this.getAssignmentGroups(
      semesterDisciplineId,
    )
    const marksConstraints = await this.getMarksConstraints()
    return { assignmentGroups, marksConstraints }
  }

  async getMarksConstraints (): Promise<MarksConstraint[]> {
    const result = await httpClient.query({
      query: GetMarksConstraintsQuery,
    })

    return result.data.data
  }

  async createAssignment (assignment: Assignment): Promise<Assignment> {
    const result = await httpClient.mutate({
      mutation: CreateAssignmentMutation,
      variables: { input: <CreateAssignmentInput>{ data: assignment } },
    })

    return result.data
  }

  async updateAssignment (assignment: Assignment): Promise<Assignment> {
    const id = assignment.id
    delete assignment.id

    if (typeof assignment.assignment_group === 'object') {
      const assignmentGroupId = assignment.assignment_group.id
      assignment.assignment_group = <any>assignmentGroupId
    }

    const result = await httpClient.mutate({
      mutation: UpdateAssignmentMutation,
      variables: { input: { where: { id }, data: assignment } },
    })

    return result.data.data.assignment
  }

  async deleteAssignment (id: ID): Promise<Assignment> {
    const result = await httpClient.mutate({
      mutation: DeleteAssignmentMutation,
      variables: { input: { where: { id } } },
    })

    return result.data.data.assignment
  }

  async getAssignmentGroups (
    semesterDisciplineId: ID,
  ): Promise<AssignmentGroup[]> {
    const result = await httpClient.query({
      query: GetAssignmentGroupQuery,
      variables: { semesterDisciplineId },
    })

    return result.data.data
  }
}
