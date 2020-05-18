/* eslint-disable @typescript-eslint/no-unused-vars */
import IUserService from '@/services/IUserService'
import { inject } from 'inversify-props'
import { Machine, assign, send } from 'xstate'
import router from '@/router'

class LandingPageMachine {
  @inject() private userService!: IUserService

  public create () {
    const loginFormMachine = Machine(
      {
        id: 'loginForm',
        initial: 'editing',
        context: {
          // @ts-ignore
          values: {
            loginResponse: null,
          },
          rules: {
            usernameRules: [
              (v: string) => !!v || 'Введите, пожалуйста, имя пользователя',
            ],
            passwordRules: [
              (v: string) => !!v || 'Введите, пожалуйста, пароль',
            ],
          },
          error: '',
          success: 'Вход успешно произведен',
        },
        states: {
          editing: {
            initial: 'pristine',
            on: {
              CHANGE: {
                actions: ['onChange'],
              },
              SUBMIT: 'submitting',
              ERROR: '.error',
              CLOSE_LOGIN_FORM: 'closed',
            },
            states: {
              pristine: {},
              error: {
                entry: 'onError',
                on: {
                  ERROR: {
                    actions: 'onError',
                  },
                },
              },
            },
          },
          submitting: {
            // @ts-ignore
            invoke: {
              src: 'onSubmit',
              onDone: {
                target: 'success',
                actions: ['onDone'],
              },
              onError: 'editing.error',
            },
          },
          success: {
            entry: 'openMarksPage',
          },
          closed: {
            type: 'final',
          },
        },
      },
      {
        actions: {
          onChange: assign({
            values: (context, event: any) => ({
              ...context.values,
              [event.key]: event.value,
            }),
          }),
          // @ts-ignore
          clearForm: assign({
            values: {},
          }),
          onDone: assign({
            values: (context, event: any) => ({
              ...context.values,
              loginResponse: event.data,
            }),
          }),
          onError: assign({ error: (context: any, event: any) => event.data }),
          openMarksPage: (context: any, event: any) =>
            setTimeout(() => router.push('marks'), 500),
        },
        services: {
          onSubmit: (context: any, _event: any) => {
            assign({ error: () => '' })
            return this.userService.login(
              context.values.username,
              context.values.password,
            )
          },
        },
      },
    )

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

const landingPageMachine = new LandingPageMachine().create()

export default landingPageMachine
