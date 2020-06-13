import { computed } from '@vue/composition-api'
import ID from '@/models/ID'
import Mark from '@/models/Mark'

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
  const getColor = (mark: number, bad = 5, good = 7, excellent = 10) => {
    if (mark <= bad) return 'red'
    else if (mark <= good) return 'yellow'
    else if (mark < excellent) return 'green'
    else if (mark === excellent) return 'teal darken-1'
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
  }
}
