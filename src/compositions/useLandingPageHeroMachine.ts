import { computed } from '@vue/composition-api'

export default function useLandingPageHeroMachine (machine: any) {
  const state = computed(() => machine.state)
  const context = computed(() => machine.state.context)
  const loginFormMachine = computed(
    () => machine.state.children.loginFormMachine,
  )
  const isLoginForm = computed(() => machine.state.matches('loginForm'))
  const isPersistent = computed(() => {
    if (loginFormMachine.value !== undefined)
      return loginFormMachine.value.state.matches('submitting')
    else return false
  })

  const send = machine.send
  const sendOpenLoginForm = () => send('OPEN_LOGIN_FORM')
  const sendCloseLoginForm = () => send('CLOSE_LOGIN_FORM')

  return {
    state,
    context,
    isLoginForm,
    isPersistent,
    loginFormMachine,
    send,
    sendOpenLoginForm,
    sendCloseLoginForm,
  }
}
