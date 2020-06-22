import { Machine, assign, sendParent } from 'xstate'

export enum FormMode {
  Showing,
  Creating,
  Editing,
}

interface FormMachineContext {
  mode: FormMode
  canEdit: boolean
  values: any
  rules: any
  error: string
  success: string
}

type FormEvents =
  | { type: 'CHANGE'; key: string; value: string }
  | { type: 'SUBMIT' }
  | { type: 'ERROR'; data: string }
  | { type: 'CLOSE_FORM' }
  | { type: 'EDIT' }
  | { type: 'DELETE' }
  | { type: 'REFRESH' }

const formMachine = Machine<FormMachineContext, FormEvents>(
  {
    id: 'form',
    initial: 'preloading',
    states: {
      preloading: {
        invoke: {
          src: 'onPreload',
          onDone: {
            actions: 'onPreloadDone',
            target: 'unknown',
          },
          onError: {
            target: 'editing.error',
          },
        },
      },
      refreshing: {
        invoke: {
          src: 'onRefresh',
          onDone: {
            actions: 'onRefreshDone',
            target: 'unknown',
          },
          onError: {
            target: 'editing.error',
          },
        },
      },
      unknown: {
        on: {
          '': [
            {
              target: 'showing',
              cond: 'isShowing',
            },
            {
              target: 'editing',
              cond: 'isCreatingOrEditing',
            },
          ],
        },
      },
      showing: {
        initial: 'unknown',
        states: {
          unknown: {
            on: {
              '': [
                {
                  target: 'editable',
                  cond: 'canEdit',
                },
                {
                  target: 'nonEditable',
                },
              ],
            },
          },
          editable: {
            on: {
              EDIT: { target: '#form.preloading', actions: 'onEditing' },
              DELETE: '#form.submitting',
              REFRESH: '#form.refreshing',
            },
          },
          nonEditable: {},
        },
        on: {
          CLOSE_FORM: '#form.closed',
        },
      },
      editing: {
        initial: 'pristine',
        on: {
          CHANGE: {
            actions: 'onChange',
          },
          SUBMIT: 'submitting',
          ERROR: '.error',
          CLOSE_FORM: 'closed',
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
        entry: ['onSuccess', 'sendRefresh'],
        on: {
          CLOSE_FORM: 'closed',
        },
      },
      closed: {
        type: 'final',
      },
    },
  },
  {
    services: {
      onPreload: () => {
        return Promise.resolve({})
      },
    },
    actions: {
      onPreloadDone: () => {},
      onPreloadError: assign({
        error: (_context, event: any) => event.message,
      }),
      sendRefresh: sendParent('REFRESH'),
      onEditing: assign({ mode: (_context, _event) => FormMode.Editing }),
    },
    guards: {
      isShowing: (context, _event) => context.mode === FormMode.Showing,
      isCreatingOrEditing: (context, _event) =>
        context.mode === FormMode.Creating || context.mode === FormMode.Editing,
      canEdit: (context, _event) => context.canEdit,
    },
  },
)

export default formMachine
