import IUserService from '@/services/IUserService'
import { inject } from 'inversify-props'
import { Machine, assign } from 'xstate'

class LandingPageMachine {
  @inject() private userService!: IUserService

  public create () {
    const loginFormMachine = Machine(
      {
        id: 'login',
        initial: 'editing',
        context: {
          // @ts-ignore
          values: {
            token: null,
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
        },
        states: {
          editing: {
            initial: 'pristine',
            on: {
              CHANGE: {
                actions: ['onChange'],
              },
              SUBMIT: 'submitting',
              ERROR: {
                target: '.error',
                actions: 'onError',
              },
            },
            states: {
              pristine: {},
              error: {},
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
              onError: {
                target: 'editing.error',
                actions: 'onError',
              },
            },
          },
          success: {
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
              token: event.data,
            }),
          }),
          onError: assign({ error: (context: any, event: any) => event.data }),
        },
        services: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const landingPageMachine = new LandingPageMachine().create()

export default landingPageMachine
