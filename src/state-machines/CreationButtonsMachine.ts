import { Machine, assign } from 'xstate'
import assignmentFormMachine, {
  assignmentContext,
} from './AssignmentFormMachine'
import ID from '@/models/ID'

interface CreationButtonsContext {
  semesterDisciplineId: ID
  error: string
}

type CreationButtonsEvent =
  | { type: 'OPEN_ASSIGNMENT_FORM' }
  | { type: 'CLOSE_ASSIGNMENT_FORM' }
  | { type: 'SELECT_SEMESTER_DISCIPLINE'; id: ID }

const creationButtonsMachine = Machine<
  CreationButtonsContext,
  CreationButtonsEvent
>(
  {
    initial: 'idle',
    context: {
      semesterDisciplineId: '',
      error: '',
    },
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
          data: (context: CreationButtonsContext, _event: any) => {
            const newContext = assignmentContext
            newContext.values.semesterDisciplineId =
              context.semesterDisciplineId
            return newContext
          },
          onDone: 'idle',
        },
        on: {
          CLOSE_ASSIGNMENT_FORM: 'idle',
        },
      },
    },
    on: {
      SELECT_SEMESTER_DISCIPLINE: {
        actions: 'setSemesterDisciplineId',
      },
    },
  },
  {
    actions: {
      setSemesterDisciplineId: assign({
        semesterDisciplineId: (_context, event: any) => event.id,
      }),
    },
  },
)

export default creationButtonsMachine
