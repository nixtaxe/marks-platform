import IMarksService from '@/services/IMarksService'
import GroupMarks from '@/models/GroupMarks'
import { load } from '@/mock/helpers'
import groupMarks from '@/mock/data/group-marks/index.json'

export default class FakeMarksService implements IMarksService {
  getGroupMarks (): Promise<GroupMarks> {
    return load<GroupMarks>(groupMarks)
  }
}
