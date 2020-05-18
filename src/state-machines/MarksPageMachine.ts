import { Machine, assign } from 'xstate'
import toolbarMachine from '@/state-machines/ToolbarMachine'
import { inject } from 'inversify-props'
import IUserService from '@/services/IUserService'
import router from '@/router'

class MarksPageMachine {
  @inject() userService!: IUserService

  public create () {
    return Machine(
      {
        id: 'marksPage',
        initial: 'loading',
        states: {
          loading: {
            invoke: {
              src: 'loadUserInfo',
              onDone: {
                target: 'loaded',
                actions: 'addUserInfoToContext',
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
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        user: (context: any, _event: any) =>
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
          addUserInfoToContext: assign({
            userInfo: (context: any, event: any) => event.data,
          }),
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
