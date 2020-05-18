import { Machine, send } from 'xstate'
import loginFormMachine from '@/state-machines/LoginFormMachine'

const landingPageHeroMachine = Machine(
  {
    id: 'landingPageHero',
    initial: 'idle',
    states: {
      idle: {
        on: { OPEN_LOGIN_FORM: 'loginForm' },
      },
      loginForm: {
        on: {
          CLOSE_LOGIN_FORM: {
            actions: 'onCloseLoginForm',
          },
        },
        invoke: {
          id: 'loginFormMachine',
          src: loginFormMachine,
          onDone: 'idle',
        },
      },
    },
  },
  {
    actions: {
      onCloseLoginForm: send('CLOSE_LOGIN_FORM', {
        to: 'loginFormMachine',
      }),
    },
  },
)

export default landingPageHeroMachine
