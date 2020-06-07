import IMarksService from '@/services/IMarksService'
import SemesterDiscipline from '@/models/SemesterDiscipline'
import { load } from '@/services/helpers'
import groupMarks from '@/mock/data/group-marks/index.json'
import Mark from '@/models/Mark'
import ID from '@/models/ID'

export default class MarksService implements IMarksService {
  deleteMark (_id: ID): Promise<Mark> {
    throw new Error('Method not implemented.')
  }
  updateMark (_mark: Mark): Promise<Mark> {
    throw new Error('Method not implemented.')
  }
  createMark (_mark: Mark): Promise<Mark> {
    throw new Error('Method not implemented.')
  }
  getSemesterDiscipline (): Promise<SemesterDiscipline> {
    return load<SemesterDiscipline>(groupMarks as any)
  }
}
