import IAssignmentService from '@/services/IAssignmentService'
import Assignment from '@/models/Assignment'
import httpClient from '@/services/HttpClient'
import CreateAssignmentMutation from './graphql/CreateAssignmentMutation'
import CreateAssignmentInput from '@/models/CreateAssignmentInput'
import AssignmentGroup from '@/models/AssignmentGroup'
import ID from '@/models/ID'
import GetAssignmentGroupsQuery from './graphql/GetAssignmentGroupsQuery'
import GetAssignmentQuery from './graphql/GetAssignmentQuery'
import UpdateAssignmentMutation from './graphql/UpdateAssignmentMutation'
import DeleteAssignmentMutation from './graphql/DeleteAssignmentMutation'
import MarksConstraint from '@/models/MarksConstraint'
import AssignmentSelections from '@/models/AssignmentSelections'
import GetMarksConstraintsQuery from './graphql/GetMarksConstraintsQuery'
import GetAssignmentGroupQuery from './graphql/GetAssignmentGroupQuery'
import UpdateAssignmentGroupMutation from './graphql/UpdateAssignmentGroupMutation'
import DeleteAssignmentGroupMutation from './graphql/DeleteAssignmentGroupMutation'
import CreateAssignmentGroupMutation from './graphql/CreateAssignmentGroupMutation'

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

    if (typeof assignment.marks_constraint === 'object') {
      const marksConstraintId = assignment.marks_constraint.id
      assignment.marks_constraint = <any>marksConstraintId
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
      query: GetAssignmentGroupsQuery,
      variables: { semesterDisciplineId },
      fetchPolicy: 'no-cache',
    })

    return result.data.data
  }

  async getAssignmentGroup (id: ID): Promise<AssignmentGroup> {
    const result = await httpClient.query({
      query: GetAssignmentGroupQuery,
      variables: { id },
      fetchPolicy: 'no-cache',
    })

    return result.data
  }

  async createAssignmentGroup (
    assignmentGroup: AssignmentGroup,
  ): Promise<AssignmentGroup> {
    const result = await httpClient.mutate({
      mutation: CreateAssignmentGroupMutation,
      variables: { input: { data: assignmentGroup } },
    })

    return result.data
  }

  async updateAssignmentGroup (
    assignmentGroup: AssignmentGroup,
  ): Promise<AssignmentGroup> {
    const id = assignmentGroup.id
    delete assignmentGroup.id

    const result = await httpClient.mutate({
      mutation: UpdateAssignmentGroupMutation,
      variables: { input: { where: { id }, data: assignmentGroup } },
    })

    return result.data
  }

  async deleteAssignmentGroup (id: ID): Promise<AssignmentGroup> {
    const result = await httpClient.mutate({
      mutation: DeleteAssignmentGroupMutation,
      variables: { input: { where: { id } } },
    })

    return result.data
  }
}
