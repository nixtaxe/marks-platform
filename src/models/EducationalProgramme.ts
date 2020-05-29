import StudentGroup from '@/models/StudentGroup'
import ID from './ID'

export default interface EducationalProgramme {
  id: ID
  name: string
  code: string
  degree: string
  student_gpoups: StudentGroup[]
}
