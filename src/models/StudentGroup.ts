import Student from '@/models/Student'
import EducationalProgramme from '@/models/EducationalProgramme'
import ID from './ID'

export default interface StudentGroup {
  id: ID
  name: string
  students: Student[]
  educational_programme: EducationalProgramme
}
