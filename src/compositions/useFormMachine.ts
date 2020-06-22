import { computed, ref } from '@vue/composition-api'

export default function useFormMachine (machine: any) {
  const state = computed(() => machine.state)
  const context = computed(() => machine.state.context)

  const form = ref({ validate: () => false })

  const isError = computed(() => machine.state.matches({ editing: 'error' }))
  const isShowing = computed(() => machine.state.matches('showing'))
  const isEditing = computed(() => machine.state.matches('editing'))
  const isSubmitting = computed(() => machine.state.matches('submitting'))
  const isRefreshing = computed(() => machine.state.matches('refreshing'))
  const isSuccess = computed(() => machine.state.matches('success'))
  const wasPreloaded = computed(() => !machine.state.matches('preloading'))
  const canEdit = computed(() => machine.state.canEdit)

  const send = machine.send
  const sendEdit = () => machine.send('EDIT')
  const sendDelete = () => machine.send('DELETE')
  const sendSubmit = () => machine.send({ type: 'SUBMIT' })
  const sendChange = ({ key, value }: { key: string; value: string }) =>
    machine.send({ type: 'CHANGE', key, value })
  const sendError = ({ data }: { data: string }) =>
    machine.send({ type: 'ERROR', data })

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
    isShowing,
    isEditing,
    isSubmitting,
    isRefreshing,
    isSuccess,
    wasPreloaded,
    canEdit,
    send,
    sendEdit,
    sendDelete,
    sendSubmit,
    sendChange,
    sendError,
    onSubmit,
  }
}
