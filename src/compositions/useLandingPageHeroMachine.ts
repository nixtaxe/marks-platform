import { ref, watch } from '@vue/composition-api'

export default function useLandingPageHeroMachine (machine: any) {
  const send = machine.send

  const sendOpenLoginForm = () => send('OPEN_LOGIN_FORM')
  const sendCloseLoginForm = () => send('CLOSE_LOGIN_FORM')

  const isLoginForm = ref(false)
  watch(
    () => machine.state.value,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (value, _) => {
      isLoginForm.value = value === 'loginForm'
    },
  )

  const loginFormMachine = ref(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  watch(isLoginForm, (opened, _) => {
    if (opened) {
      loginFormMachine.value = machine.state.children.loginFormMachine
    } else {
      loginFormMachine.value = null
      sendCloseLoginForm()
    }
  })

  return {
    state: machine.state,
    send,
    sendOpenLoginForm,
    sendCloseLoginForm,
    isLoginForm,
    loginFormMachine,
  }
}
