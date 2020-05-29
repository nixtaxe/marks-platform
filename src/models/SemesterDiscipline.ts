import TeacherDisciplineStudentGroup from '@/models/TeacherDisciplineStudentGroup'
import AssignmentGroup from '@/models/AssignmentGroup'
import ID from './ID'

export default interface SemesterDiscipline {
  id: ID
  teacher_discipline_student_group: TeacherDisciplineStudentGroup
  assignment_groups: AssignmentGroup[]
}
