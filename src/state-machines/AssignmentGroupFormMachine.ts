import { assign, send, sendParent } from 'xstate'
import formMachine, { FormMode } from './FormMachine'
import { inject } from 'inversify-props'
import IAssignmentService from '@/services/IAssignmentService'
import AssignmentGroup from '@/models/AssignmentGroup'
import ID from '@/models/ID'
import IntegrationType from '@/models/IntegrationType'
import MarksConstraint from '@/models/MarksConstraint'

interface AssignmentGroupFormRules {
  nameRules: Function[]
  percentageRules: Function[]
  integrationTypeRules: Function[]
  marksConstraintRules: Function[]
}

interface AssignmentGroupFormValues {
  remainingPercentages: number
  assignmentGroup: AssignmentGroup
  semesterDisciplineId: ID
  integrationTypes: IntegrationType[]
  marksConstraints: MarksConstraint[]
  assignmentGroupResponse?: AssignmentGroup
}

interface AssignmentGroupFormContext {
  mode: FormMode
  values: AssignmentGroupFormValues
  rules: AssignmentGroupFormRules
  error: string
  success: string
}

export const assignmentGroupContext = () =>
  <AssignmentGroupFormContext>{
    mode: FormMode.Creating,
    values: <any>{
      remainingPercentages: 100,
      assignmentGroup: <any>{ semester_discipline: '1' },
      integrationTypes: [],
      marksConstraints: [],
    },
    rules: {
      nameRules: [(v: string) => !!v || 'Введите название группы заданий'],
      percentageRules: [
        (v: string) => v !== '' || 'Введите вес группы в процентах',
      ],
      integrationTypeRules: [(v: string) => !!v || 'Выберите тип интеграции'],
      marksConstraintRules: [
        (v: string) => !!v || 'Выберите тип оценки по умолчанию',
      ],
    },
    error: '',
    success: 'Группа заданий создана',
  }

type AssignmentGroupFormEvent =
  | { type: 'CREATE_ASSIGNMENT_GROUP' }
  | { type: 'REFRESH' }

class AssignmentGroupFormMachine {
  @inject() assignmentService!: IAssignmentService
  public create () {
    return formMachine.withConfig({
      services: {
        onSubmit: (context: AssignmentGroupFormContext, event: any) => {
          assign({ error: () => '' })
          if (event.type === 'DELETE')
            return this.assignmentService.deleteAssignmentGroup(
              context.values.assignmentGroup.id,
            )
          else if ('id' in context.values.assignmentGroup)
            return this.assignmentService.updateAssignmentGroup(
              context.values.assignmentGroup,
            )
          else
            return this.assignmentService.createAssignmentGroup(
              context.values.assignmentGroup,
            )
        },
        onPreload: (context: AssignmentGroupFormContext, _event: any) => {
          assign({ error: () => '' })
          if (context.mode === FormMode.Showing)
            return this.assignmentService.getAssignmentGroup(
              context.values.assignmentGroup.id,
            )
          else
            return this.assignmentService.getAssignmentGroupSelections(
              context.values.semesterDisciplineId,
            )
        },
        onRefresh: (context: AssignmentGroupFormContext, _event: any) => {
          assign({ error: () => '' })
          return this.assignmentService.refreshImport(
            context.values.assignmentGroup.id,
          )
        },
      },
      actions: {
        onChange: assign({
          values: (context, event: any) => ({
            ...context.values,
            assignmentGroup: {
              ...context.values.assignmentGroup,
              [event.key]: event.value,
            },
          }),
        }),
        onPreloadDone: assign({
          values: (context, event: any) => {
            let assignmentGroups
            if (context.mode === FormMode.Showing)
              assignmentGroups =
                event.data.semester_discipline.assignment_groups
            else assignmentGroups = event.data.assignment_groups

            const remainingPercentages = assignmentGroups.reduce(
              (acc: number, current: AssignmentGroup) =>
                acc - current.percentage,
              100,
            )

            if (context.mode === FormMode.Showing) {
              delete event.data.semester_discipline
              return {
                ...context.values,
                integrationTypes: [event.data.integration_type],
                marksConstraints: [event.data.default_marks_constraint],
                assignmentGroup: event.data,
                remainingPercentages,
              }
            } else
              return {
                ...context.values,
                ...event.data,
                remainingPercentages,
              }
          },
        }),
        onRefreshDone: sendParent('REFRESH'),
        onDone: assign({
          values: (context, event: any) => ({
            ...context.values,
            assignmentGroupResponse: event.data,
          }),
        }),
        onError: assign({ error: (_context, event: any) => event.data }),
        onSuccess: send('CLOSE_FORM', { delay: 500 }),
      },
    })
  }
}

const getAssignmentGroupFormMachine = () =>
  new AssignmentGroupFormMachine()
    .create()
    .withContext(assignmentGroupContext())

export default getAssignmentGroupFormMachine
