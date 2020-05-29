import SemesterDiscipline from '@/models/SemesterDiscipline'
import TableHeader from '@/models/TableHeader'
import TableItem from '@/models/TableItem'

export default function getMarksDataForTable (groupMarks: SemesterDiscipline) {
  const groupName =
    groupMarks.teacher_discipline_student_group?.student_group.name
  const studentGroup = groupMarks.teacher_discipline_student_group.student_group
  const studentAssignments = groupMarks.assignment_groups.flatMap(
    (ag) => ag?.assignments,
  )
  const headers: TableHeader[] = [
    { text: 'Студент', value: 'name', sortable: false },
  ].concat(
    studentAssignments.map((x) => {
      return { text: x.title, value: x.id as string, sortable: false }
    }),
  )
  let items: TableItem[] = []
  studentGroup.students.forEach((x) => {
    items.push({
      id: x.id,
      name: `${x.user.familyName} ${x.user.name} ${x.user.patronymic}`,
    })
  })
  studentAssignments.forEach((x, i) => {
    // @ts-ignore
    x.marks.forEach((y) => (items[i][x.id] = y.value))
  })

  return { groupName, headers, items }
}
