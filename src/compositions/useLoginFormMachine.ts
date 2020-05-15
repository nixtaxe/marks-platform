import { ref, computed } from '@vue/composition-api'

export default function useLoginFormMachine (machine: any) {
  const state = computed(() => machine.state)
  const context = computed(() => machine.state.context)
  const form = ref({ validate: () => false })
  const isError = computed(() => machine.state.matches({ editing: 'error' }))
  const isSubmitting = computed(() => machine.state.matches('submitting'))
  const hasToken = computed(() => machine.state.conxtext.values.token !== null)

  const send = machine.send
  const sendSubmit = () => send({ type: 'SUBMIT' })
  const sendChange = ({ key, value }: { key: string; value: string }) =>
    send({ type: 'CHANGE', key, value })
  const sendError = ({ data }: { data: string }) =>
    send({ type: 'ERROR', data })

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
    isSubmitting,
    hasToken,
    usernameRules: machine.state.context.rules.usernameRules,
    passwordRules: machine.state.context.rules.passwordRules,
    send,
    sendSubmit,
    sendChange,
    sendError,
    onSubmit,
  }
}
