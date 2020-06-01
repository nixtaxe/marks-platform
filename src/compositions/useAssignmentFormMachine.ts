import { computed, ref } from '@vue/composition-api'

export default function useAssignmentFormMachine (machine: any) {
  const state = computed(() => machine.state)
  const context = computed(() => machine.state.context)
  const form = ref({ validate: () => false })
  const isError = computed(() => machine.state.matches({ editing: 'error' }))
  const isEditing = computed(() => machine.state.matches('editing'))
  const isSubmitting = computed(() => machine.state.matches('submitting'))
  const isSuccess = computed(() => machine.state.matches('success'))

  const send = machine.send
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
    isError,
    isEditing,
    isSubmitting,
    isSuccess,
    titleRules: machine.state.context.rules.titleRules,
    send,
    sendSubmit,
    sendChange,
    sendError,
    onSubmit,
    onPickDeadlineDate,
  }
}
