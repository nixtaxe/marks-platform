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
  canEdit: boolean
  error: string
}

type CreationButtonsEvent =
  | { type: 'REFRESH' }
  | { type: 'OPEN_ASSIGNMENT_FORM' }
  | { type: 'OPEN_ASSIGNMENT_GROUP_FORM' }
  | { type: 'CLOSE_ASSIGNMENT_FORM' }
  | { type: 'CLOSE_ASSIGNMENT_GROUP_FORM' }
  | { type: 'SELECT_SEMESTER_DISCIPLINE'; id: ID; canEdit: boolean }

const creationButtonsMachine = Machine<
  CreationButtonsContext,
  CreationButtonsEvent
>(
  {
    initial: 'unknown',
    context: {
      semesterDisciplineId: '',
      canEdit: false,
      error: '',
    },
    states: {
      unknown: {
        on: {
          '': [
            {
              target: 'idle',
              cond: 'canEdit',
            },
            {
              target: 'hidden',
            },
          ],
        },
      },
      hidden: {},
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
            const newContext = assignmentContext()
            newContext.values.semesterDisciplineId =
              context.semesterDisciplineId
            newContext.mode = FormMode.Editing
            newContext.canEdit = context.canEdit
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
            const newContext = assignmentGroupContext()
            newContext.values.semesterDisciplineId =
              context.semesterDisciplineId
            newContext.values.assignmentGroup.semester_discipline = <any>(
              context.semesterDisciplineId
            )
            newContext.mode = FormMode.Editing
            newContext.canEdit = context.canEdit
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
        target: 'unknown',
        actions: 'setValues',
      },
      REFRESH: { actions: 'sendRefresh' },
    },
  },
  {
    actions: {
      sendRefresh: sendParent('REFRESH'),
      setValues: assign({
        semesterDisciplineId: (_context, event: any) => event.id,
        canEdit: (_context, event: any) => event.canEdit,
      }),
    },
    guards: {
      canEdit: (context, _event) => context.canEdit,
    },
  },
)

export default creationButtonsMachine
