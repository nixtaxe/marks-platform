import GroupMarks from '@/models/GroupMarks'

export default interface IMarksService {
  getGroupMarks(): Promise<GroupMarks>
}
