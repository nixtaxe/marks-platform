import { Machine, assign } from 'xstate'
import { inject } from 'inversify-props'
import IMarksService from '@/services/IMarksService'
import GroupMarks from '@/models/GroupMarks'
import TableHeader from '@/models/TableHeader'
import TableItem from '@/models/TableItem'
import getMarksDataForTable from '@/helpers/getMarksDataForTable'

interface MarksTableContext {
  user: User
  marksTable?: GroupMarks
  groupName?: string
  headers?: TableHeader[]
  studentMarks?: TableItem[]
  error?: string
}

type MarksTableEvent = { type: 'REFRESH' }

class MarksTableMachine {
  @inject() marksService!: IMarksService
  public create () {
    return Machine<MarksTableContext, MarksTableEvent>(
      {
        id: 'marksTable',
        initial: 'loading',
        states: {
          loading: {
            invoke: {
              src: 'loadMarksTable',
              onDone: {
                target: 'loaded',
                actions: 'saveMarksTable',
              },
              onError: 'failure',
            },
          },
          loaded: {
            initial: 'idle',
            states: {
              idle: {},
            },
            on: {
              REFRESH: 'loading',
            },
          },
          failure: {
            on: {
              REFRESH: 'loading',
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
              marksTable: event.data,
            }
          }),
        },
        services: {
          loadMarksTable: () => {
            return this.marksService.getGroupMarks()
          },
        },
      },
    )
  }
}

const marksTableMachine = new MarksTableMachine().create()
export default marksTableMachine
