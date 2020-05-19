import Mark from '@/models/Mark'

export default interface StudentMarks {
  id: number
  student: User
  marks: Mark[]
}
