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

export default class AssignmentService implements IAssignmentService {
  async getAssignment (id: ID): Promise<Assignment> {
    const result = await httpClient.query({
      query: GetAssignmentQuery,
      variables: { id },
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

    const assignment_group = assignment.assignment_group.id
    delete assignment.assignment_group
    assignment.assignment_group = <any>assignment_group

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
