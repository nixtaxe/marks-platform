import { Machine, assign, send, actions } from 'xstate'
const { pure } = actions
import toolbarMachine from '@/state-machines/ToolbarMachine'
import { inject } from 'inversify-props'
import IUserService from '@/services/IUserService'
import router from '@/router'
import marksTableMachine, {
  marksTableContext,
} from '@/state-machines/MarksTableMachine'
import creationButtonsMachine from './CreationButtonsMachine'
import ID from '@/models/ID'
import User from '@/models/User'

interface MarksPageContext {
  user: User
  canEdit: boolean
}

type MarksPageEvent =
  | { type: 'LOGOUT' }
  | { type: 'REFRESH' }
  | { type: 'SELECT_SEMESTER_DISCIPLINE'; id: ID; userId: ID }

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
                      onError: { actions: 'showError' },
                    },
                    on: {
                      SELECT_SEMESTER_DISCIPLINE: {
                        actions: [
                          'setCanEdit',
                          'notifyMarksTableMachine',
                          'notifyCreationButtonsMachine',
                        ],
                      },
                    },
                  },
                  marksTable: {
                    invoke: {
                      id: 'marksTableMachine',
                      src: marksTableMachine,
                      data: (context: MarksPageContext, _event: any) => {
                        const newContext = marksTableContext()
                        newContext.user = context.user
                        return newContext
                      },
                      onError: { actions: 'showError' },
                    },
                  },
                  creationButtons: {
                    invoke: {
                      id: 'creationButtonsMachine',
                      src: creationButtonsMachine,
                      onError: { actions: 'showError' },
                    },
                  },
                },
                on: {
                  REFRESH: { actions: 'sendRefresh' },
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
          sendRefresh: send('REFRESH', { to: 'marksTableMachine' }),
          setCanEdit: assign({
            canEdit: (context, event: any) => context.user.id === event.userId,
          }),
          notifyMarksTableMachine: pure((context, event: any) =>
            send(
              { ...event, canEdit: context.canEdit },
              { to: 'marksTableMachine' },
            ),
          ),
          notifyCreationButtonsMachine: pure((context, event: any) =>
            send(
              { ...event, canEdit: context.canEdit },
              { to: 'creationButtonsMachine' },
            ),
          ),
          showError: (_context, event: any) => {
            // eslint-disable-next-line no-console
            console.error(event)
          },
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
