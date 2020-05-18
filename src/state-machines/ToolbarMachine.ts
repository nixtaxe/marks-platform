import { Machine, sendParent } from 'xstate'
import { inject } from 'inversify-props'
import IUserService from '@/services/IUserService'

interface ToolbarContext {
  user: User
}

type ToolbarEvent = { type: 'LOGOUT' }

class ToolbarMachine {
  @inject() userService!: IUserService

  public create () {
    return Machine<ToolbarContext, ToolbarEvent>(
      {
        id: 'toolbar',
        initial: 'idle',
        states: {
          idle: {},
        },
        on: {
          LOGOUT: {
            actions: 'logout',
          },
        },
      },
      {
        actions: {
          logout: sendParent('LOGOUT'),
        },
      },
    )
  }
}

const toolbarMachine = new ToolbarMachine().create()

export default toolbarMachine
