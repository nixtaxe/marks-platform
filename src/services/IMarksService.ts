import SemesterDiscipline from '@/models/SemesterDiscipline'
import ID from '@/models/ID'

export default interface IMarksService {
  getSemesterDiscipline(id: ID): Promise<SemesterDiscipline>
}
