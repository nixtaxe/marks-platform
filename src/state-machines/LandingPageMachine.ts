/* eslint-disable @typescript-eslint/no-unused-vars */
import IUserService from '@/services/IUserService'
import { inject } from 'inversify-props'
import { Machine, interpret } from 'xstate'

class LandingPageMachine {
  @inject() private userService!: IUserService

  public createMachine () {
    const loginMachine = Machine({
      id: 'login',
      initial: 'idle',
      context: {
        data: null,
        error: null,
      },
      states: {
        idle: {
          on: { FETCH: 'loading' },
        },
        loading: {
          invoke: {
            src: (_: any, event: any) =>
              this.userService.login(
                event.value.username,
                event.value.password,
              ),
            onDone: {
              target: 'success',
            },
            onError: {
              target: 'failure',
            },
          },
        },
        success: {
          type: 'final',
        },
        failure: {
          on: { FETCH: 'loading' },
        },
      },
    })

    const loginFormMachine = Machine(
      {
        id: 'loginForm',
        initial: 'empty',
        context: {
          username: '',
          password: '',
          usernameError: null,
          passwordError: null,
          token: null,
        },
        on: {
          TYPING: [
            { target: '.invalid', cond: 'isEmpty' },
            {
              target: '.valid',
            },
          ],
        },
        states: {
          empty: {},
          // @ts-ignore
          valid: {
            invoke: {
              id: 'login',
              src: loginMachine,
            },
          },
          invalid: {},
        },
      },
      {
        guards: {
          isEmpty: (context: any, event: any) => {
            return (
              !event.value.username.trim().length &&
              !event.value.password.trim().length
            )
          },
        },
      },
    )

    const landingPageHeroMachine = Machine({
      id: 'landingPageHero',
      initial: 'idle',
      states: {
        idle: {
          on: { OPEN_LOGIN_FORM: 'loginForm' },
        },
        loginForm: {
          on: { CLOSE_LOGIN_FORM: 'idle' },
          invoke: {
            id: 'loginFormMachine',
            src: loginFormMachine,
          },
        },
      },
    })

    const landingPageMachine = Machine({
      id: 'landingPage',
      initial: 'landingPageHero',
      states: {
        landingPageHero: {
          invoke: {
            id: 'landingPageHeroMachine',
            src: landingPageHeroMachine,
          },
        },
      },
    })
    return landingPageMachine
  }
}

const landingPageMachine = new LandingPageMachine().createMachine()

export default landingPageMachine
