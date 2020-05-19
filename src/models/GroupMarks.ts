import StudentMarks from '@/models/StudentMarks'

export default interface GroupMarks {
  groupName: string
  studentMarks: StudentMarks[]
}
