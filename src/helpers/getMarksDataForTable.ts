import SemesterDiscipline from '@/models/SemesterDiscipline'
import TableHeader from '@/models/TableHeader'
import TableItem from '@/models/TableItem'
import Mark from '@/models/Mark'

export default function getMarksDataForTable (groupMarks: SemesterDiscipline) {
  const groupName =
    groupMarks.teacher_discipline_student_group.student_group.name
  const studentGroup = groupMarks.teacher_discipline_student_group.student_group
  const studentAssignments = groupMarks.assignment_groups.flatMap(
    (ag) => ag.assignments,
  )
  const assignmentGroups = groupMarks.assignment_groups.flatMap((ag) => ({
    text: ag.name,
    value: ag.id,
    width: ag.assignments.length,
  }))
  const headers: TableHeader[] = [
    {
      text: 'Студент',
      value: 'name',
      sortable: false,
      width: '200px',
      fixed: true,
    },
  ].concat(
    studentAssignments.map((x) => {
      return {
        ...x,
        text: x.title,
        value: x.id,
        sortable: false,
        width: '32px',
        fixed: false,
      }
    }),
  )
  let items: TableItem[] = []
  studentGroup.students.forEach((x) => {
    items.push({
      id: x.id,
      name: {
        value: `${x.user.familyName} ${x.user.name} ${x.user.patronymic}`,
      },
    })
    studentAssignments.forEach((x) => {
      // @ts-ignore
      items[items.length - 1][x.id] = {}
    })
  })

  studentAssignments.forEach((assignment) => {
    assignment.marks.forEach((mark: Mark) => {
      const itemId = items.findIndex((k) => k.id === mark.student.id)
      const markData = {
        id: mark.id,
        value: mark.value,
        student: mark.student.id,
        assignment: mark.assignment.id,
      }
      // @ts-ignore
      items[itemId][assignment.id] = markData
    })
  })

  return { groupName, assignmentGroups, headers, items }
}
