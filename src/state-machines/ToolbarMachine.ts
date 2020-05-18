import { Machine, sendParent } from 'xstate'
import { inject } from 'inversify-props'
import IUserService from '@/services/IUserService'

class ToolbarMachine {
  @inject() userService!: IUserService

  public create () {
    return Machine(
      {
        id: 'toolbar',
        initial: 'idle',
        context: {
          user: {
            name: 'Иванов И.И.',
          },
        },
        states: {
          idle: {},
        },
        on: {
          LOGOUT: 'logout',
        },
      },
      {
        actions: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          logout: (context: any, event: any) => {
            this.userService.logout()
            sendParent('LOGOUT')
          },
        },
      },
    )
  }
}

const toolbarMachine = new ToolbarMachine().create()

export default toolbarMachine
