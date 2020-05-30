import { assign } from 'xstate'
import { inject } from 'inversify-props'
import IUserService from '@/services/IUserService'
import router from '@/router'
import LoginResponse from '@/models/LoginResponse'
import formMachine, { FormMode } from './FormMachine'

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
  mode: FormMode
  values: LoginFormValues
  rules: LoginFormRules
  error: string
  success: string
}

const loginFormContext = <LoginFormContext>{
  mode: FormMode.Creating,
  values: {
    username: '',
    password: '',
  },
  rules: {
    usernameRules: [
      (v: string) => !!v || 'Введите, пожалуйста, имя пользователя',
    ],
    passwordRules: [(v: string) => !!v || 'Введите, пожалуйста, пароль'],
  },
  error: '',
  success: 'Вход успешно произведен',
}

class LoginFormMachine {
  @inject() private userService!: IUserService

  public create () {
    return formMachine.withConfig({
      services: {
        onSubmit: (context: LoginFormContext, _event: any) => {
          assign({ error: () => '' })
          return this.userService.login(
            context.values.username,
            context.values.password,
          )
        },
      },
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
        onSuccess: () => setTimeout(() => router.push('marks'), 500),
      },
    })
  }
}

const loginFormMachine = new LoginFormMachine()
  .create()
  .withContext(loginFormContext)

export default loginFormMachine
