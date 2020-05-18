import { Machine, assign } from 'xstate'
import { inject } from 'inversify-props'
import IUserService from '@/services/IUserService'
import router from '@/router'

class LoginFormMachine {
  @inject() private userService!: IUserService

  public create () {
    return Machine(
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
          clearForm: assign({
            values: () => {},
          }),
          onDone: assign({
            values: (context, event: any) => ({
              ...context.values,
              loginResponse: event.data,
            }),
          }),
          onError: assign({ error: (_context: any, event: any) => event.data }),
          openMarksPage: () => setTimeout(() => router.push('marks'), 500),
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
  }
}

const loginFormMachine = new LoginFormMachine().create()

export default loginFormMachine
