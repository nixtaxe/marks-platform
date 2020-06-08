import TeacherDisciplineStudentGroup from '@/models/TeacherDisciplineStudentGroup'
import AssignmentGroup from '@/models/AssignmentGroup'
import ID from './ID'
import SemesterDates from './SemesterDates'

export default interface SemesterDiscipline {
  id: ID
  semesterDates: SemesterDates
  teacher_discipline_student_group: TeacherDisciplineStudentGroup
  assignment_groups: AssignmentGroup[]
}
