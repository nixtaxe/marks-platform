import { computed, watch } from '@vue/composition-api'
import ID from '@/models/ID'
import Mark from '@/models/Mark'
import MarksConstraint from '@/models/MarksConstraint'
import Assignment from '@/models/Assignment'
import AssignmentGroup from '@/models/AssignmentGroup'

export default function useMarksTableMachine (machine: any) {
  const groupName = computed(() => machine.state.context.groupName)
  const assignmentGroups = computed(
    () => machine.state.context.assignmentGroups,
  )
  const headers = computed(() => machine.state.context.headers)
  const studentMarks = computed(() => machine.state.context.studentMarks)
  const assignmentFormMachine = computed(
    () => machine.state.children.assignmentFormMachine,
  )

  const isLoading = computed(() => machine.state.matches('loading'))
  const isLoaded = computed(() => machine.state.matches('loaded'))
  const isFailure = computed(() => machine.state.matches('failure'))
  const isAssignmentForm = computed(() =>
    machine.state.matches('loaded.assignmentForm'),
  )
  const isPersistentAssignmentForm = computed(() => {
    if (assignmentFormMachine.value !== undefined)
      return assignmentFormMachine.value.state.matches('submitting')
    else return false
  })
  const send = machine.send
  const sendRefresh = () => send('REFRESH')
  const sendCreateMark = (mark: Mark) => send('CREATE_MARK', { mark })
  const sendUpdateMark = (mark: Mark) => send('UPDATE_MARK', { mark })
  const sendDeleteMark = (id: ID) => send('DELETE_MARK', { id })
  const sendOpenAssignmentForm = (id: ID) =>
    send('OPEN_ASSIGNMENT_FORM', { id })
  const sendCloseAssignmentForm = () => send('CLOSE_ASSIGNMENT_FORM')
  const getColor = (mark: number, header: any) => {
    const { satisfactory, good, excellent } = header.marks_constraint
    if (mark >= excellent) return 'teal'
    else if (mark >= good) return 'green'
    else if (mark >= satisfactory) return 'orange'
    else return 'red'
  }
  const performMutation = (mark: Mark, student: ID, assignment: ID) => {
    if ('id' in mark) {
      if (mark.value.toString() === '') {
        sendDeleteMark(mark.id)
      } else {
        const newMark = mark
        newMark.value = +newMark.value
        sendUpdateMark(newMark)
      }
    } else {
      const newMark = <any>{
        value: +mark!.value,
        student,
        assignment,
      }
      sendCreateMark(newMark)
    }
  }

  const checkKey = ($event: any, marksConstraint: MarksConstraint) => {
    const resultValue = $event.target.value + $event.key
    const parsedValue = parseFloat(resultValue)
    if (
      isNaN(resultValue) ||
      parsedValue < marksConstraint.minValue ||
      parsedValue > marksConstraint.maxValue
    ) {
      $event.preventDefault()
    }
  }

  watch(
    () => machine.state.context.studentMarks,
    (marks) => {
      if (marks === undefined) return

      marks.forEach((marksRow: any) => {
        let studentSemesterMark = 0.0

        machine.state.context.assignmentGroups.forEach(
          (ag: AssignmentGroup) => {
            ag.assignments.forEach((assignment: Assignment) => {
              const mark = marksRow[assignment.id]
              let markValue = assignment.marks_constraint.minValue
              if ('value' in mark && mark.value !== '')
                markValue = parseFloat(mark.value)
              studentSemesterMark +=
                ((markValue / assignment.marks_constraint.maxValue) *
                  ag.percentage) /
                ag.assignments.length
            })
          },
        )

        marksRow.semester_mark.value = studentSemesterMark
      })
    },
  )

  return {
    groupName,
    assignmentGroups,
    headers,
    studentMarks,
    assignmentFormMachine,
    isLoading,
    isLoaded,
    isFailure,
    isAssignmentForm,
    isPersistentAssignmentForm,
    sendRefresh,
    performMutation,
    sendOpenAssignmentForm,
    sendCloseAssignmentForm,
    getColor,
    checkKey,
  }
}
