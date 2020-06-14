import { computed } from '@vue/composition-api'

export default function useCreationButtonsMachine (machine: any) {
  const state = computed(() => machine.state)
  const context = computed(() => machine.state.context)
  const assignmentFormMachine = computed(
    () => machine.state.children.assignmentFormMachine,
  )
  const assignmentGroupFormMachine = computed(
    () => machine.state.children.assignmentGroupFormMachine,
  )
  const isAssignmentForm = computed(() =>
    machine.state.matches('assignmentForm'),
  )
  const isAssignmentGroupForm = computed(() =>
    machine.state.matches('assignmentGroupForm'),
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
  const sendOpenAssignmentForm = () => send('OPEN_ASSIGNMENT_FORM')
  const sendCloseAssignmentForm = () => send('CLOSE_ASSIGNMENT_FORM')
  const sendOpenAssignmentGroupForm = () => send('OPEN_ASSIGNMENT_GROUP_FORM')
  const sendCloseAssignmentGroupForm = () => send('CLOSE_ASSIGNMENT_GROUP_FORM')

  return {
    state,
    context,
    assignmentFormMachine,
    assignmentGroupFormMachine,
    isAssignmentForm,
    isAssignmentGroupForm,
    isPersistentAssignmentForm,
    isPersistentAssignmentGroupForm,
    send,
    sendOpenAssignmentForm,
    sendCloseAssignmentForm,
    sendOpenAssignmentGroupForm,
    sendCloseAssignmentGroupForm,
  }
}
