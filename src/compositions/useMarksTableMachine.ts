import { computed } from '@vue/composition-api'
import ID from '@/models/ID'
import Mark from '@/models/Mark'
import MarksConstraint from '@/models/MarksConstraint'

export default function useMarksTableMachine (machine: any) {
  const groupName = computed(() => machine.state.context.groupName)
  const disciplineName = computed(() => machine.state.context.disciplineName)
  const teacherFullName = computed(() => machine.state.context.teacherFullName)
  const assignmentGroups = computed(
    () => machine.state.context.assignmentGroups,
  )
  const headers = computed(() => machine.state.context.headers)
  const studentMarks = computed(() => machine.state.context.studentMarks)
  const assignmentFormMachine = computed(
    () => machine.state.children.assignmentFormMachine,
  )
  const assignmentGroupFormMachine = computed(
    () => machine.state.children.assignmentGroupFormMachine,
  )

  const isLoading = computed(() => machine.state.matches('loading'))
  const isLoaded = computed(() => machine.state.matches('loaded'))
  const isFailure = computed(() => machine.state.matches('failure'))
  const isAssignmentForm = computed(() =>
    machine.state.matches('loaded.assignmentForm'),
  )
  const isAssignmentGroupForm = computed(() =>
    machine.state.matches('loaded.assignmentGroupForm'),
  )
  const isPersistentAssignmentForm = computed(() => {
    if (assignmentFormMachine.value !== undefined)
      return assignmentFormMachine.value.state.matches('submitting')
    else return false
  })
  const isPersistentAssignmentGroupForm = computed(() => {
    if (assignmentGroupFormMachine.value !== undefined)
      return assignmentGroupFormMachine.value.state.matches('submitting')
    else return false
  })
  const send = machine.send
  const sendRefresh = () => send('REFRESH')
  const sendCreateMark = (mark: Mark) => send('CREATE_MARK', { mark })
  const sendUpdateMark = (mark: Mark) => send('UPDATE_MARK', { mark })
  const sendDeleteMark = (id: ID) => send('DELETE_MARK', { id })
  const sendOpenAssignmentForm = (id: ID) =>
    send('OPEN_ASSIGNMENT_FORM', { id })
  const sendOpenAssignmentGroupForm = (id: ID) =>
    send('OPEN_ASSIGNMENT_GROUP_FORM', { id })
  const sendCloseAssignmentForm = () => send('CLOSE_ASSIGNMENT_FORM')
  const sendCloseAssignmentGroupForm = () => send('CLOSE_ASSIGNMENT_GROUP_FORM')
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

  const filterByName = (_value: any, search: string | null, item: any) => {
    return (
      search !== null &&
      item.name.value.toLowerCase().indexOf(search.toLowerCase() || '') !== -1
    )
  }

  return {
    groupName,
    disciplineName,
    teacherFullName,
    assignmentGroups,
    headers,
    studentMarks,
    assignmentFormMachine,
    assignmentGroupFormMachine,
    isLoading,
    isLoaded,
    isFailure,
    isAssignmentForm,
    isAssignmentGroupForm,
    isPersistentAssignmentForm,
    isPersistentAssignmentGroupForm,
    sendRefresh,
    performMutation,
    sendOpenAssignmentForm,
    sendOpenAssignmentGroupForm,
    sendCloseAssignmentForm,
    sendCloseAssignmentGroupForm,
    getColor,
    checkKey,
    filterByName,
  }
}
