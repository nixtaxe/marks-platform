import { Machine } from 'xstate'
// import { FormMode } from './FormMachine'
import assignmentFormMachine from './AssignmentFormMachine'

interface CreationButtonsContext {
  error: string
}

type CreationButtonsEvent =
  | { type: 'OPEN_ASSIGNMENT_FORM' }
  | { type: 'CLOSE_ASSIGNMENT_FORM' }

const creationButtonsMachine = Machine<
  CreationButtonsContext,
  CreationButtonsEvent
>({
  initial: 'idle',
  states: {
    idle: {
      on: {
        OPEN_ASSIGNMENT_FORM: 'assignmentForm',
      },
    },
    assignmentForm: {
      invoke: {
        id: 'assignmentFormMachine',
        src: assignmentFormMachine,
        onDone: 'idle',
      },
      on: {
        CLOSE_ASSIGNMENT_FORM: 'idle',
      },
    },
  },
})

export default creationButtonsMachine
