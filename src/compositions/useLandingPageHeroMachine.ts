import { watch, computed } from '@vue/composition-api'

export default function useLandingPageHeroMachine (machine: any) {
  const state = computed(() => machine.state)
  const context = computed(() => machine.state.context)
  const loginFormMachine = computed(
    () => machine.state.children.loginFormMachine,
  )
  const isLoginForm = computed(() => machine.state.matches('loginForm'))

  const send = machine.send
  const sendOpenLoginForm = () => send('OPEN_LOGIN_FORM')
  const sendCloseLoginForm = () => send('CLOSE_LOGIN_FORM')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  watch(isLoginForm, (opened, _) => {
    if (!opened) {
      sendCloseLoginForm()
    }
  })

  return {
    state,
    context,
    isLoginForm,
    loginFormMachine,
    send,
    sendOpenLoginForm,
    sendCloseLoginForm,
  }
}
