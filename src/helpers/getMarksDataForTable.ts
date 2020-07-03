import SemesterDiscipline from '@/models/SemesterDiscipline'
import TableHeader from '@/models/TableHeader'
import TableItem from '@/models/TableItem'
import Mark from '@/models/Mark'
import calculateSemesterMarks from './calculateSemesterMarks'
import AssignmentGroup from '@/models/AssignmentGroup'
import Student from '@/models/Student'
import getSemesterTimeAndYear from './getSemesterTimeAndYear'
import {
  NameFormat,
  AssignmentFormat,
} from '@/state-machines/MarksTableMachine'
import getFormattedName from './getFormattedName'

export default function getMarksDataForTable (
  groupMarks: SemesterDiscipline,
  options = {
    nameFormat: NameFormat.FamilyName,
    assignmentFormat: AssignmentFormat.Position,
  },
) {
  const groupName =
    groupMarks.teacher_discipline_student_group.student_group.name
  const disciplineName =
    groupMarks.teacher_discipline_student_group.academic_discipline.name
  const teacherUser = groupMarks.teacher_discipline_student_group.teacher.user
  const teacherFullName = `${teacherUser.familyName} ${teacherUser.name} ${teacherUser.patronymic}`
  let startDate = getSemesterTimeAndYear(groupMarks.semesterDates.startDate)
  const studentGroup = groupMarks.teacher_discipline_student_group.student_group
  const studentAssignments = groupMarks.assignment_groups.flatMap((ag) =>
    ag.assignments.length
      ? ag.assignments
      : [
        {
          title: '',
          id: `${ag.id}-${ag.name}`,
          marks: <any>[],
        },
      ],
  )
  const assignmentGroups = groupMarks.assignment_groups.flatMap((ag) => ({
    text: ag.name,
    value: ag.id,
    width: ag.assignments.length,
    ...ag,
  }))

  const ratingConstraints = {
    minValue: 0,
    maxValue: 100,
    satisfactory: 61,
    good: 71,
    excellent: 86,
  }

  let i = 1
  let agId = 0
  const headers: TableHeader[] = [
    <any>{
      text: 'Студент',
      value: 'name',
      isAssignment: false,
      editable: false,
      sortable: false,
      simple: true,
      width: '200px',
      fixed: true,
    },
  ]
    .concat(
      studentAssignments.map((x) => {
        //@ts-ignore
        if (agId !== x.assignment_group.id) {
          //@ts-ignore
          agId = x.assignment_group.id
          i = 1
        }

        if (x.title === '')
          return {
            ...x,
            text: x.title,
            value: x.id,
            isAssignment: false,
            editable: false,
            sortable: false,
            simple: true,
            fixed: false,
          }
        else {
          let result = {
            ...x,
            text: x.title,
            position: i++,
            value: x.id,
            isAssignment: true,
            editable: true,
            sortable: false,
            simple: false,
            fixed: false,
          }
          if (options.assignmentFormat !== AssignmentFormat.Position)
            delete result.position
          return result
        }
      }),
    )
    .concat({
      text: 'Рейтинг(%)',
      value: 'rating',
      isAssignment: false,
      editable: false,
      sortable: false,
      simple: false,
      width: '200px',
      fixed: true,
      marks_constraint: ratingConstraints,
    })
    .concat({
      text: 'Итоговая оценка',
      value: 'semester_mark',
      isAssignment: false,
      editable: false,
      sortable: false,
      simple: false,
      width: '200px',
      fixed: true,
      marks_constraint: groupMarks.marks_constraint,
    })

  let items: TableItem[] = []
  const sortFullNames = (a: Student, b: Student) => {
    if (a.user.familyName > b.user.familyName) return 1
    else if (a.user.familyName === b.user.familyName)
      if (a.user.name > b.user.name) return 1
      else if (a.user.name === b.user.name)
        if (a.user.patronymic > b.user.patronymic) return 1
        else return -1
      else return -1
    else return -1
  }
  studentGroup.students = studentGroup.students.sort(sortFullNames)
  studentGroup.students.forEach((x) => {
    items.push({
      id: x.id,
      name: {
        value: getFormattedName(x.user, options.nameFormat),
      },
      semester_mark: { value: 0.0 },
    })
    studentAssignments.forEach((x) => {
      // @ts-ignore
      items[items.length - 1][x.id] = {}
    })
    assignmentGroups.forEach((ag: AssignmentGroup) => {
      if (ag.assignments.length === 0) {
        // @ts-ignore
        items[items.length - 1][`${ag.id}-${ag.name}`] = { value: '' }
      }
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

  items = calculateSemesterMarks(
    items,
    assignmentGroups,
    groupMarks.marks_constraint,
  )

  return {
    groupName,
    disciplineName,
    teacherFullName,
    startDate,
    assignmentGroups,
    headers,
    items,
  }
}
