import Teacher from './Teacher'
import AcademicDiscipline from './AcademicDiscipline'
import StudentGroup from './StudentGroup'

export default interface TeacherDisciplineStudentGroup {
  teacher: Teacher
  academic_discipline: AcademicDiscipline
  student_group: StudentGroup
}
