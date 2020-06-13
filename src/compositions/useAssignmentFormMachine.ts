import { computed, ref, watch } from '@vue/composition-api'

export default function useAssignmentFormMachine (machine: any) {
  const state = computed(() => machine.state)
  const context = computed(() => machine.state.context)
  const form = ref({ validate: () => false })
  const assignmentGroups = computed(
    () => machine.state.context.values.assignmentGroups,
  )
  const marksConstraints = computed(
    () => machine.state.context.values.marksConstraints,
  )
  var title = ref('')
  var deadlineDate = ref('')
  var selectedAssignmentGroup = ref(null)
  var selectedMarksConstraint = ref(null)

  const isError = computed(() => machine.state.matches({ editing: 'error' }))
  const isShowing = computed(() => machine.state.matches('showing'))
  const isEditing = computed(() => machine.state.matches('editing'))
  const isSubmitting = computed(() => machine.state.matches('submitting'))
  const isSuccess = computed(() => machine.state.matches('success'))
  const wasPreloaded = computed(() => !machine.state.matches('preloading'))

  watch(isShowing, (value) => {
    if (value) {
      title.value = machine.state.context.values.assignment!.title
      deadlineDate.value = machine.state.context.values.assignment!.deadlineDate
      selectedAssignmentGroup.value = machine.state.context.values.assignment!.assignment_group!.id
      selectedMarksConstraint.value = machine.state.context.values.assignment!.marks_constraint!.id
    }
  })

  const send = machine.send
  const sendEdit = () => machine.send('EDIT')
  const sendDelete = () => machine.send('DELETE')
  const sendSubmit = () => machine.send({ type: 'SUBMIT' })
  const sendChange = ({ key, value }: { key: string; value: string }) =>
    machine.send({ type: 'CHANGE', key, value })
  const sendError = ({ data }: { data: string }) =>
    machine.send({ type: 'ERROR', data })

  const onPickDeadlineDate = (save: Function, deadlineDate: string) => {
    save(deadlineDate)
    sendChange({ key: 'deadlineDate', value: deadlineDate })
  }

  const onSubmit = () => {
    const isFormValid: boolean = form.value.validate()
    if (!isFormValid) sendError({ data: 'Исправьте поля' })
    else sendSubmit()
  }

  return {
    state,
    context,
    form,
    assignmentGroups,
    marksConstraints,
    title,
    deadlineDate,
    selectedAssignmentGroup,
    selectedMarksConstraint,
    isError,
    isShowing,
    isEditing,
    isSubmitting,
    isSuccess,
    wasPreloaded,
    titleRules: machine.state.context.rules.titleRules,
    assignmentGroupRules: machine.state.context.rules.assignmentGroupRules,
    marksConstraintRules: machine.state.context.rules.marksConstraintRules,
    send,
    sendEdit,
    sendDelete,
    sendSubmit,
    sendChange,
    sendError,
    onSubmit,
    onPickDeadlineDate,
  }
}
