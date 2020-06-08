import IMarksService from '../IMarksService'
import ID from '@/models/ID'
import SemesterDiscipline from '@/models/SemesterDiscipline'
import httpClient from '@/services/HttpClient'
import GetSemesterDiscipline from './graphql/GetSemesterDiscipline'
import CreateMarkMutation from './graphql/CreateMarkMutation'
import Mark from '@/models/Mark'
import DeleteMarkMutation from './graphql/DeleteMarkMutation'
import UpdateMarkMutation from './graphql/UpdateMarkMutation'
import GetSemesterDisciplinesQuery from './graphql/GetSemesterDisciplinesQuery'

export default class MarksService implements IMarksService {
  async getSemesterDisciplines (): Promise<SemesterDiscipline[]> {
    const result = await httpClient.query({
      query: GetSemesterDisciplinesQuery,
    })

    return result.data.data
  }

  async getSemesterDiscipline (id: ID): Promise<SemesterDiscipline> {
    const result = await httpClient.query({
      query: GetSemesterDiscipline,
      variables: { id },
      fetchPolicy: 'no-cache',
    })

    return result.data.data
  }

  async createMark (mark: Mark): Promise<Mark> {
    const result = await httpClient.mutate({
      mutation: CreateMarkMutation,
      variables: { input: { data: mark } },
    })

    return result.data.data.mark
  }

  async deleteMark (id: ID): Promise<Mark> {
    const result = await httpClient.mutate({
      mutation: DeleteMarkMutation,
      variables: { input: { where: { id } } },
    })

    return result.data.data.mark
  }

  async updateMark (mark: Mark): Promise<Mark> {
    const id = mark.id
    delete mark.id
    const result = await httpClient.mutate({
      mutation: UpdateMarkMutation,
      variables: { input: { where: { id }, data: mark } },
    })

    return result.data.data.mark
  }
}
