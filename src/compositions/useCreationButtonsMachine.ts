import { computed } from '@vue/composition-api'

export default function useCreationButtonsMachine (machine: any) {
  const state = computed(() => machine.state)
  const context = computed(() => machine.state.context)
  const assignmentFormMachine = computed(
    () => machine.state.children.assignmentFormMachine,
  )
  const isAssignmentForm = computed(() =>
    machine.state.matches('assignmentForm'),
  )
  const isPersistentAssignmentForm = computed(() => {
    if (assignmentFormMachine.value !== undefined)
      return assignmentFormMachine.value.state.matches('submitting')
    else return false
  })

  const send = machine.send
  const sendOpenAssignmentForm = () => send('OPEN_ASSIGNMENT_FORM')
  const sendCloseAssignmentForm = () => send('CLOSE_ASSIGNMENT_FORM')

  return {
    state,
    context,
    isAssignmentForm,
    isPersistentAssignmentForm,
    assignmentFormMachine,
    send,
    sendOpenAssignmentForm,
    sendCloseAssignmentForm,
  }
}
