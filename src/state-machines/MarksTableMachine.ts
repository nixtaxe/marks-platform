import { Machine, assign } from 'xstate'
import { inject } from 'inversify-props'
import IMarksService from '@/services/IMarksService'
import SemesterDiscipline from '@/models/SemesterDiscipline'
import TableHeader from '@/models/TableHeader'
import TableItem from '@/models/TableItem'
import getMarksDataForTable from '@/helpers/getMarksDataForTable'
import ID from '@/models/ID'
import Mark from '@/models/Mark'
import assignmentFormMachine, {
  assignmentContext,
} from './AssignmentFormMachine'
import { FormMode } from './FormMachine'
import assignmentGroupFormMachine, {
  assignmentGroupContext,
} from './AssignmentGroupFormMachine'

export enum NameFormat {
  FamilyName,
  FamilyNameAndName,
  FullName,
}

export enum AssignmentFormat {
  Position,
  Title,
}

interface MarksTableContext {
  nameFormat: NameFormat
  assignmentFormat: AssignmentFormat
  nameFormats: any[]
  assignmentFormats: any[]
  semesterDisciplineId: ID
  user: User
  canEdit: boolean
  semesterDiscipline: SemesterDiscipline
  groupName: string
  disciplineName: string
  teacherFullName: string
  assignmentGroups: any[]
  headers: TableHeader[]
  studentMarks: TableItem[]
  error: string
}

type MarksTableEvent =
  | { type: 'REFRESH' }
  | { type: 'SELECT_SEMESTER_DISCIPLINE'; id: ID; canEdit: boolean }
  | { type: 'CREATE_MARK'; mark: Mark }
  | { type: 'UPDATE_MARK'; mark: Mark }
  | { type: 'DELETE_MARK'; id: ID }
  | { type: 'OPEN_ASSIGNMENT_FORM'; id: ID }
  | { type: 'OPEN_ASSIGNMENT_GROUP_FORM'; id: ID }
  | { type: 'CLOSE_ASSIGNMENT_FORM' }
  | { type: 'CLOSE_ASSIGNMENT_GROUP_FORM' }
  | { type: 'SELECT_NAME_FORMAT'; format: NameFormat }
  | { type: 'SELECT_ASSIGNMENT_FORMAT'; format: AssignmentFormat }

class MarksTableMachine {
  @inject() marksService!: IMarksService
  public create () {
    return Machine<MarksTableContext, MarksTableEvent>(
      {
        id: 'marksTable',
        initial: 'loaded',
        states: {
          loading: {
            initial: 'refreshing',
            states: {
              refreshing: {
                invoke: {
                  src: 'loadMarksTable',
                  onDone: {
                    target: '#marksTable.loaded',
                    actions: 'saveMarksTable',
                  },
                  onError: '#marksTable.error',
                },
              },
              creatingMark: {
                invoke: {
                  src: 'createMark',
                  onDone: {
                    target: 'refreshing',
                  },
                  onError: {
                    target: '#marksTable.loaded',
                    actions: 'showError',
                  },
                },
              },
              updatingMark: {
                invoke: {
                  src: 'updateMark',
                  onDone: {
                    target: 'refreshing',
                  },
                  onError: {
                    target: '#marksTable.loaded',
                    actions: 'showError',
                  },
                },
              },
              deletingMark: {
                invoke: {
                  src: 'deleteMark',
                  onDone: {
                    target: 'refreshing',
                  },
                  onError: {
                    target: '#marksTable.loaded',
                    actions: 'showError',
                  },
                },
              },
            },
          },
          loaded: {
            initial: 'idle',
            states: {
              idle: {
                on: {
                  SELECT_NAME_FORMAT: { actions: 'refreshNameFormat' },
                  SELECT_ASSIGNMENT_FORMAT: {
                    actions: 'refreshAssignmentFormat',
                  },
                },
              },
              assignmentForm: {
                invoke: {
                  id: 'assignmentFormMachine',
                  src: assignmentFormMachine,
                  data: (context: MarksTableContext, event: any) => {
                    const newContext = assignmentContext()
                    newContext.values.semesterDisciplineId =
                      context.semesterDisciplineId
                    newContext.mode = FormMode.Showing
                    newContext.values.assignment.id = event.id
                    newContext.canEdit = context.canEdit
                    return newContext
                  },
                },
              },
              assignmentGroupForm: {
                invoke: {
                  id: 'assignmentGroupFormMachine',
                  src: assignmentGroupFormMachine,
                  data: (context: MarksTableContext, event: any) => {
                    const newContext = assignmentGroupContext()
                    newContext.values.semesterDisciplineId =
                      context.semesterDisciplineId
                    newContext.mode = FormMode.Showing
                    newContext.values.assignmentGroup.id = event.id
                    newContext.canEdit = context.canEdit
                    return newContext
                  },
                },
              },
            },
            on: {
              REFRESH: '#marksTable.loading.refreshing',
              SELECT_SEMESTER_DISCIPLINE: {
                target: '#marksTable.loading.refreshing',
                actions: 'setValues',
              },
              CREATE_MARK: '#marksTable.loading.creatingMark',
              UPDATE_MARK: '#marksTable.loading.updatingMark',
              DELETE_MARK: '#marksTable.loading.deletingMark',
              OPEN_ASSIGNMENT_FORM: '.assignmentForm',
              OPEN_ASSIGNMENT_GROUP_FORM: '.assignmentGroupForm',
              CLOSE_ASSIGNMENT_FORM: '.idle',
              CLOSE_ASSIGNMENT_GROUP_FORM: '.idle',
            },
          },
          error: {
            entry: 'showError',
            on: {
              SELECT_SEMESTER_DISCIPLINE: {
                target: 'loading.refreshing',
                actions: 'setSemesterDisciplineId',
              },
              REFRESH: 'loading.refreshing',
            },
          },
        },
      },
      {
        actions: {
          saveMarksTable: assign((context: MarksTableContext, event: any) => {
            const {
              groupName,
              disciplineName,
              teacherFullName,
              startDate,
              assignmentGroups,
              headers,
              items: studentMarks,
            } = getMarksDataForTable(event.data)
            return {
              ...context,
              groupName,
              disciplineName,
              teacherFullName,
              startDate,
              assignmentGroups,
              headers,
              studentMarks,
              semesterDiscipline: event.data,
            }
          }),
          showError: (_context, event: any) => {
            // eslint-disable-next-line no-console
            console.error(event)
          },
          setValues: assign({
            semesterDisciplineId: (_context, event: any) => event.id,
            canEdit: (_context, event: any) => event.canEdit,
          }),
          refreshNameFormat: assign(
            (context: MarksTableContext, event: any) => {
              const {
                items: studentMarks,
              } = getMarksDataForTable(context.semesterDiscipline, {
                nameFormat: event.format,
                assignmentFormat: context.assignmentFormat,
              })
              return {
                ...context,
                nameFormat: event.format,
                studentMarks,
              }
            },
          ),
          refreshAssignmentFormat: assign(
            (context: MarksTableContext, event: any) => {
              const {
                headers,
              } = getMarksDataForTable(context.semesterDiscipline, {
                nameFormat: context.nameFormat,
                assignmentFormat: event.format,
              })
              return {
                ...context,
                assignmentFormat: event.format,
                headers,
              }
            },
          ),
        },
        services: {
          loadMarksTable: (context) =>
            this.marksService.getSemesterDiscipline(
              context.semesterDisciplineId,
            ),
          createMark: (_context, event) =>
            this.marksService.createMark(event.mark),
          deleteMark: (_context, event) =>
            this.marksService.deleteMark(event.id),
          updateMark: (_context, event) =>
            this.marksService.updateMark(event.mark),
        },
      },
    )
  }
}

export const marksTableContext = () =>
  <MarksTableContext>{
    nameFormat: NameFormat.FamilyName,
    assignmentFormat: AssignmentFormat.Position,
    nameFormats: [
      {
        text: 'Фамилия',
        value: NameFormat.FamilyName,
      },
      {
        text: 'Фамилия Имя',
        value: NameFormat.FamilyNameAndName,
      },
      {
        text: 'ФИО',
        value: NameFormat.FullName,
      },
    ],
    assignmentFormats: [
      {
        text: 'Позиция в группе заданий',
        value: AssignmentFormat.Position,
      },
      {
        text: 'Название',
        value: AssignmentFormat.Title,
      },
    ],
  }

const marksTableMachine = new MarksTableMachine()
  .create()
  .withContext(marksTableContext())
export default marksTableMachine
