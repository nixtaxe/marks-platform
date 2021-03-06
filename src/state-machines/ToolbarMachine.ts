import { Machine, sendParent, assign } from 'xstate'
import { inject } from 'inversify-props'
import IUserService from '@/services/IUserService'
import ID from '@/models/ID'
import getToolbarSearchData from '@/helpers/getToolbarSearchData'
import SelectionSemesterDiscipline from '@/models/SelectionSemesterDiscipline'
import IMarksService from '@/services/IMarksService'
import SemesterDiscipline from '@/models/SemesterDiscipline'
import User from '@/models/User'
import getRelevantSemesterDisciplines from '@/helpers/getRelevantSemesterDisciplines'

interface ToolbarContext {
  rawSemesterDisciplines: SemesterDiscipline[]
  semesterDisciplines: SelectionSemesterDiscipline[]
  filteredSemesterDisciplines: SelectionSemesterDiscipline[]
  relevantSemesterDisciplines: any[]
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
            const rawSemesterDisciplines = event.data
            const semesterDisciplines = getToolbarSearchData(
              rawSemesterDisciplines,
            )
            const filteredSemesterDisciplines = semesterDisciplines
            const relevantSemesterDisciplines = getRelevantSemesterDisciplines(
              context.user,
              rawSemesterDisciplines,
            )
            return {
              ...context,
              rawSemesterDisciplines,
              semesterDisciplines,
              filteredSemesterDisciplines,
              relevantSemesterDisciplines,
            }
          }),
          selectSemesterDiscipline: sendParent(
            (context: ToolbarContext, event: any) => ({
              type: 'SELECT_SEMESTER_DISCIPLINE',
              id: event.id,
              userId: context.rawSemesterDisciplines.find(
                (x) => x.id === event.id,
              )?.teacher_discipline_student_group.teacher.user.id,
            }),
          ),
          searchSemesterDiscipline: assign((context, event: any) => {
            const pieces = event.searchValue.split(' ')
            const filteredSemesterDisciplines = context.semesterDisciplines.filter(
              ({ text }: { text: string }) => {
                const lowerCaseText = (text || '').toLowerCase()
                const result = pieces.reduce(
                  (acc: boolean, current: string) =>
                    lowerCaseText.indexOf((current || '').toLowerCase()) > -1 &&
                    acc,
                  true,
                )
                return result
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
