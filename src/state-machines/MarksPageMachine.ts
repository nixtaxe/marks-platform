import { Machine, assign } from 'xstate'
import toolbarMachine from '@/state-machines/ToolbarMachine'
import { inject } from 'inversify-props'
import IUserService from '@/services/IUserService'
import router from '@/router'
import marksTableMachine from '@/state-machines/MarksTableMachine'
import creationButtonsMachine from './CreationButtonsMachine'

interface MarksPageContext {
  user: User
}

type MarksPageEvent = { type: 'LOGOUT' }

class MarksPageMachine {
  @inject() userService!: IUserService

  public create () {
    return Machine<MarksPageContext, MarksPageEvent>(
      {
        id: 'marksPage',
        initial: 'loading',
        states: {
          loading: {
            invoke: {
              id: 'loadUserInfo',
              src: 'loadUserInfo',
              onDone: {
                target: 'loaded',
                actions: 'saveUserInfo',
              },
              onError: 'closed',
            },
          },
          loaded: {
            initial: 'main',
            states: {
              main: {
                type: 'parallel',
                states: {
                  toolbar: {
                    invoke: {
                      id: 'toolbarMachine',
                      src: toolbarMachine,
                      data: {
                        user: (context: MarksPageContext) => context.user,
                      },
                    },
                  },
                  marksTable: {
                    invoke: {
                      id: 'marksTableMachine',
                      src: marksTableMachine,
                      data: {
                        user: (context: MarksPageContext) => context.user,
                      },
                    },
                  },
                  creationButtons: {
                    invoke: {
                      id: 'creationButtonsMachine',
                      src: creationButtonsMachine,
                    },
                  },
                },
              },
            },
          },
          closed: {
            type: 'final',
            entry: 'openLandingPage',
          },
        },
        on: {
          LOGOUT: {
            target: '.closed',
            actions: 'logout',
          },
        },
      },
      {
        actions: {
          saveUserInfo: assign({
            user: (_context, event: any) => event.data,
          }),
          logout: () => this.userService.logout(),
          openLandingPage: () => router.replace('/'),
        },
        services: {
          loadUserInfo: () => this.userService.getUserInfo(),
        },
      },
    )
  }
}

const marksPageMachine = new MarksPageMachine().create()

export default marksPageMachine
