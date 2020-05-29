import IMarksService from '@/services/IMarksService'
import SemesterDiscipline from '@/models/SemesterDiscipline'
import { load } from '@/services/helpers'
import groupMarks from '@/mock/data/group-marks/index.json'

export default class FakeMarksService implements IMarksService {
  getSemesterDiscipline (): Promise<SemesterDiscipline> {
    return load<SemesterDiscipline>(groupMarks as any)
  }
}
