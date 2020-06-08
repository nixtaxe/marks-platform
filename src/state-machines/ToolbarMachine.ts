import { Machine, sendParent, assign } from 'xstate'
import { inject } from 'inversify-props'
import IUserService from '@/services/IUserService'
import ID from '@/models/ID'
import getToolbarSearchData from '@/helpers/getToolbarSearchData'
import SelectionSemesterDiscipline from '@/models/SelectionSemesterDiscipline'
import IMarksService from '@/services/IMarksService'

interface ToolbarContext {
  semesterDisciplines: SelectionSemesterDiscipline[]
  filteredSemesterDisciplines: SelectionSemesterDiscipline[]
  user: User
}

type ToolbarEvent =
  | { type: 'LOGOUT' }
  | { type: 'SELECT_SEMESTER_DISCIPLINE'; id: ID }
  | { type: 'SEARCH_SEMESTER_DISCIPLINE'; searchValue: string }

class ToolbarMachine {
  @inject() userService!: IUserService
  @inject() marksService!: IMarksService

  public create () {
    return Machine<ToolbarContext, ToolbarEvent>(
      {
        id: 'toolbar',
        initial: 'loading',
        states: {
          idle: {},
          loading: {
            invoke: {
              src: 'getSemesterDisciplines',
              onDone: { target: 'idle', actions: 'saveSemesterDisciplines' },
              onError: { target: 'idle', actions: 'showError' },
            },
          },
        },
        on: {
          LOGOUT: {
            actions: 'logout',
          },
          SELECT_SEMESTER_DISCIPLINE: {
            actions: 'selectSemesterDiscipline',
          },
          SEARCH_SEMESTER_DISCIPLINE: {
            actions: 'searchSemesterDiscipline',
          },
        },
      },
      {
        services: {
          getSemesterDisciplines: () =>
            this.marksService.getSemesterDisciplines(),
        },
        actions: {
          logout: sendParent('LOGOUT'),
          saveSemesterDisciplines: assign((context, event: any) => {
            const semesterDisciplines = getToolbarSearchData(event.data)
            const filteredSemesterDisciplines = semesterDisciplines
            return {
              ...context,
              semesterDisciplines,
              filteredSemesterDisciplines,
            }
          }),
          selectSemesterDiscipline: sendParent(
            (_context: ToolbarContext, event: any) => ({
              type: 'SELECT_SEMESTER_DISCIPLINE',
              id: event.id,
            }),
          ),
          searchSemesterDiscipline: assign((context, event: any) => {
            const filteredSemesterDisciplines = context.semesterDisciplines.filter(
              ({ text }: { text: string }) => {
                return (
                  (text || '')
                    .toLowerCase()
                    .indexOf((event.searchValue || '').toLowerCase()) > -1
                )
              },
            )
            return {
              ...context,
              filteredSemesterDisciplines,
            }
          }),
          showError: (_context, event: any) => {
            // eslint-disable-next-line no-console
            console.error(event)
          },
        },
      },
    )
  }
}

const toolbarMachine = new ToolbarMachine().create()

export default toolbarMachine
