import Student from '@/models/Student'
import Assignment from '@/models/Assignment'
import ID from './ID'

export default interface Mark {
  id: ID
  date: string
  value: number
  assignment: Assignment
  student: Student
}
