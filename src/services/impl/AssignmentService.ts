import IAssignmentService from '@/services/IAssignmentService'
import Assignment from '@/models/Assignment'
import httpClient from '@/services/HttpClient'
import CreateAssignmentMutation from './graphql/CreateAssignmentMutation'
import CreateAssignmentInput from '@/models/CreateAssignmentInput'
import AssignmentGroup from '@/models/AssignmentGroup'
import ID from '@/models/ID'
import GetAssignmentGroupQuery from './graphql/GetAssignmentGroupsQuery'

export default class AssignmentService implements IAssignmentService {
  async createAssignment (assignment: Assignment): Promise<Assignment> {
    const result = await httpClient.mutate({
      mutation: CreateAssignmentMutation,
      variables: { input: <CreateAssignmentInput>{ data: assignment } },
    })

    return result.data
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
