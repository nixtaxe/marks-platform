import TeacherDisciplineStudentGroup from '@/models/TeacherDisciplineStudentGroup'
import AssignmentGroup from '@/models/AssignmentGroup'
import ID from './ID'
import SemesterDates from './SemesterDates'
import MarksConstraint from './MarksConstraint'

export default interface SemesterDiscipline {
  id: ID
  semesterDates: SemesterDates
  marks_constraint: MarksConstraint
  teacher_discipline_student_group: TeacherDisciplineStudentGroup
  assignment_groups: AssignmentGroup[]
}
