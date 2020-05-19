import LoginResponse from '@/models/LoginResponse'
import { Machine, assign, DoneInvokeEvent } from 'xstate'
import toolbarMachine from '@/state-machines/ToolbarMachine'
import { inject } from 'inversify-props'
import IUserService from '@/services/IUserService'
import router from '@/router'

interface MarksPageContext {
  userInfo: LoginResponse
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
                actions: assign({
                  userInfo: (_context, event: DoneInvokeEvent<LoginResponse>) =>
                    event.data,
                }),
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
                        user: (context: MarksPageContext) =>
                          context.userInfo.user,
                      },
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
