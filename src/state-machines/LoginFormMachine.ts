import { Machine, assign } from 'xstate'
import { inject } from 'inversify-props'
import IUserService from '@/services/IUserService'
import router from '@/router'
import LoginResponse from '@/models/LoginResponse'

interface LoginFormValues {
  username: string
  password: string
  loginResponse?: LoginResponse
}

interface LoginFormRules {
  usernameRules: Function[]
  passwordRules: Function[]
}

interface LoginFormContext {
  values: LoginFormValues
  rules: LoginFormRules
  error?: string
  success?: string
}

type LoginFormEvents =
  | { type: 'CHANGE'; key: string; value: string }
  | { type: 'SUBMIT' }
  | { type: 'ERROR'; data: string }
  | { type: 'CLOSE_LOGIN_FORM' }

class LoginFormMachine {
  @inject() private userService!: IUserService

  public create () {
    return Machine<LoginFormContext, LoginFormEvents>(
      {
        id: 'loginForm',
        initial: 'editing',
        context: {
          values: {
            username: '',
            password: '',
          },
          rules: {
            usernameRules: [
              (v: string) => !!v || 'Введите, пожалуйста, имя пользователя',
            ],
            passwordRules: [
              (v: string) => !!v || 'Введите, пожалуйста, пароль',
            ],
          },
          success: 'Вход успешно произведен',
        },
        states: {
          editing: {
            initial: 'pristine',
            on: {
              CHANGE: {
                actions: 'onChange',
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
                actions: 'onDone',
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
          onDone: assign({
            values: (context, event: any) => ({
              ...context.values,
              loginResponse: event.data,
            }),
          }),
          onError: assign({ error: (_context, event: any) => event.data }),
          openMarksPage: () => setTimeout(() => router.push('marks'), 500),
        },
        services: {
          onSubmit: (context: LoginFormContext, _event: any) => {
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
