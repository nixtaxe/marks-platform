import SemesterDiscipline from '@/models/SemesterDiscipline'
import getSemesterTimeAndYear from './getSemesterTimeAndYear'

export default function getToolbarSearchData (
  semesterDisciplines: SemesterDiscipline[],
) {
  const items = semesterDisciplines.map((semesterDiscipline) => {
    return {
      text: `${getSemesterTimeAndYear(
        semesterDiscipline.semesterDates.startDate,
      )} - ${
        semesterDiscipline.teacher_discipline_student_group.student_group.name
      } - ${
        semesterDiscipline.teacher_discipline_student_group.academic_discipline
          .name
      }`,
      value: semesterDiscipline.id,
    }
  })

  return items
}
