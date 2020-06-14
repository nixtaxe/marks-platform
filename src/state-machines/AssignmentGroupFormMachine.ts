import { assign, send } from 'xstate'
import formMachine, { FormMode } from './FormMachine'
import { inject } from 'inversify-props'
import IAssignmentService from '@/services/IAssignmentService'
import AssignmentGroup from '@/models/AssignmentGroup'
import ID from '@/models/ID'

interface AssignmentGroupFormRules {
  nameRules: Function[]
}

interface AssignmentGroupFormValues {
  assignmentGroup: AssignmentGroup
  semesterDisciplineId: ID
  assignmentGroupResponse?: AssignmentGroup
}

interface AssignmentGroupFormContext {
  mode: FormMode
  values: AssignmentGroupFormValues
  rules: AssignmentGroupFormRules
  error: string
  success: string
}

export const assignmentGroupContext = <AssignmentGroupFormContext>{
  mode: FormMode.Creating,
  values: <AssignmentGroupFormValues>{
    assignmentGroup: <any>{ semester_discipline: '1' },
  },
  rules: {
    nameRules: [(v: string) => !!v || 'Введите название группы заданий'],
  },
  error: '',
  success: 'Группа заданий создана',
}

type AssignmentGroupFormEvent = { type: 'CREATE_ASSIGNMENT_GROUP' }

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
          else return Promise.resolve()
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
            if (context.mode === FormMode.Showing)
              return {
                ...context.values,
                assignmentGroup: event.data,
              }
            else
              return {
                ...context.values,
              }
          },
        }),
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
  new AssignmentGroupFormMachine().create().withContext(assignmentGroupContext)

export default getAssignmentGroupFormMachine
