import { Machine, assign } from 'xstate'
import { inject } from 'inversify-props'
import IMarksService from '@/services/IMarksService'
import SemesterDiscipline from '@/models/SemesterDiscipline'
import TableHeader from '@/models/TableHeader'
import TableItem from '@/models/TableItem'
import getMarksDataForTable from '@/helpers/getMarksDataForTable'
import ID from '@/models/ID'
import Mark from '@/models/Mark'

interface MarksTableContext {
  semesterDisciplineId: ID
  user: User
  semesterDiscipline: SemesterDiscipline
  groupName: string
  headers: TableHeader[]
  studentMarks: TableItem[]
  error: string
}

type MarksTableEvent =
  | { type: 'REFRESH' }
  | { type: 'CREATE_MARK'; mark: Mark }
  | { type: 'UPDATE_MARK'; mark: Mark }
  | { type: 'DELETE_MARK'; id: ID }

class MarksTableMachine {
  @inject() marksService!: IMarksService
  public create () {
    return Machine<MarksTableContext, MarksTableEvent>(
      {
        id: 'marksTable',
        initial: 'loading',
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
              idle: {},
            },
            on: {
              REFRESH: '#marksTable.loading.refreshing',
              CREATE_MARK: '#marksTable.loading.creatingMark',
              UPDATE_MARK: '#marksTable.loading.updatingMark',
              DELETE_MARK: '#marksTable.loading.deletingMark',
            },
          },
          error: {
            entry: 'onError',
            on: {
              REFRESH: 'loading.refreshing',
            },
          },
        },
      },
      {
        actions: {
          saveMarksTable: assign((context, event: any) => {
            const {
              groupName,
              headers,
              items: studentMarks,
            } = getMarksDataForTable(event.data)
            return {
              groupName,
              headers,
              studentMarks,
              semesterDiscipline: event.data,
            }
          }),
          showError: (_context, event: any) => {
            // eslint-disable-next-line no-console
            console.error(event)
          },
        },
        services: {
          loadMarksTable: () => this.marksService.getSemesterDiscipline('1'),
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

const marksTableMachine = new MarksTableMachine().create()
export default marksTableMachine
