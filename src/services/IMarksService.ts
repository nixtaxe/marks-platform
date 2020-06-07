import SemesterDiscipline from '@/models/SemesterDiscipline'
import ID from '@/models/ID'
import Mark from '@/models/Mark'

export default interface IMarksService {
  getSemesterDiscipline(id: ID): Promise<SemesterDiscipline>
  createMark(mark: Mark): Promise<Mark>
  deleteMark(id: ID): Promise<Mark>
  updateMark(mark: Mark): Promise<Mark>
}
