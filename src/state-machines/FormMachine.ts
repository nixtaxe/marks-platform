import { Machine } from 'xstate'

export enum FormMode {
  Showing,
  Creating,
  Editing,
}

interface FormMachineContext {
  mode: FormMode
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

const formMachine = Machine<FormMachineContext, FormEvents>(
  {
    id: 'form',
    initial: 'unknown',
    states: {
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
        on: {
          CLOSE_FORM: 'closed',
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
        entry: 'onSuccess',
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
    guards: {
      isShowing: (context, _event) => context.mode === FormMode.Showing,
      isCreatingOrEditing: (context, _event) =>
        context.mode === FormMode.Creating || context.mode === FormMode.Editing,
    },
  },
)

export default formMachine
