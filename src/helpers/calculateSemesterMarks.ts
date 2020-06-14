import AssignmentGroup from '@/models/AssignmentGroup'
import Assignment from '@/models/Assignment'

export default function calculateSemesterMarks (
  marks: any,
  assignmentGroups: AssignmentGroup[],
): any[] {
  const result = new Array(marks.length)

  marks.forEach((marksRow: any, i: number) => {
    let studentSemesterMark = 0.0

    assignmentGroups.forEach((ag: AssignmentGroup) => {
      ag.assignments.forEach((assignment: Assignment) => {
        const mark = marksRow[assignment.id]
        let markValue = assignment.marks_constraint.minValue
        if ('value' in mark && mark.value !== '')
          markValue = parseFloat(mark.value)
        studentSemesterMark +=
          ((markValue / assignment.marks_constraint.maxValue) * ag.percentage) /
          (ag.assignments.length || 1)
      })
    })

    result[i] = { ...marksRow, semester_mark: { value: studentSemesterMark } }
  })

  return result
}
