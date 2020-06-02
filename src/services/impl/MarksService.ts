import IMarksService from '../IMarksService'
import ID from '@/models/ID'
import SemesterDiscipline from '@/models/SemesterDiscipline'
import httpClient from '@/services/HttpClient'
import GetSemesterDiscipline from './graphql/GetSemesterDiscipline'

export default class MarksService implements IMarksService {
  async getSemesterDiscipline (id: ID): Promise<SemesterDiscipline> {
    const result = await httpClient.query({
      query: GetSemesterDiscipline,
      variables: { id },
    })

    return result.data.data
  }
}
