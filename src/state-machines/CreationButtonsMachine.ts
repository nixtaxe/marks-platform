import { Machine, assign, sendParent } from 'xstate'
import assignmentFormMachine, {
  assignmentContext,
} from './AssignmentFormMachine'
import assignmentGroupFormMachine, {
  assignmentGroupContext,
} from './AssignmentGroupFormMachine'
import ID from '@/models/ID'
import { FormMode } from './FormMachine'

interface CreationButtonsContext {
  semesterDisciplineId: ID
  error: string
}

type CreationButtonsEvent =
  | { type: 'REFRESH' }
  | { type: 'OPEN_ASSIGNMENT_FORM' }
  | { type: 'OPEN_ASSIGNMENT_GROUP_FORM' }
  | { type: 'CLOSE_ASSIGNMENT_FORM' }
  | { type: 'CLOSE_ASSIGNMENT_GROUP_FORM' }
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
          OPEN_ASSIGNMENT_GROUP_FORM: 'assignmentGroupForm',
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
            newContext.mode = FormMode.Editing
            return newContext
          },
          onDone: 'idle',
        },
        on: {
          CLOSE_ASSIGNMENT_FORM: 'idle',
        },
      },
      assignmentGroupForm: {
        invoke: {
          id: 'assignmentGroupFormMachine',
          src: assignmentGroupFormMachine,
          data: (context: CreationButtonsContext, _event: any) => {
            const newContext = assignmentGroupContext
            newContext.values.assignmentGroup.semester_discipline = <any>(
              context.semesterDisciplineId
            )
            newContext.mode = FormMode.Editing
            return newContext
          },
          onDone: 'idle',
        },
        on: {
          CLOSE_ASSIGNMENT_GROUP_FORM: 'idle',
        },
      },
    },
    on: {
      SELECT_SEMESTER_DISCIPLINE: {
        actions: 'setSemesterDisciplineId',
      },
      REFRESH: { actions: 'sendRefresh' },
    },
  },
  {
    actions: {
      sendRefresh: sendParent('REFRESH'),
      setSemesterDisciplineId: assign({
        semesterDisciplineId: (_context, event: any) => event.id,
      }),
    },
  },
)

export default creationButtonsMachine
