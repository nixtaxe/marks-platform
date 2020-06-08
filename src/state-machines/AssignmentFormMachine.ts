import { assign, send } from 'xstate'
import Assignment from '@/models/Assignment'
import formMachine, { FormMode } from './FormMachine'
import { inject } from 'inversify-props'
import IAssignmentService from '@/services/IAssignmentService'
import AssignmentGroup from '@/models/AssignmentGroup'
import ID from '@/models/ID'

interface AssignmentFormRules {
  titleRules: Function[]
}

interface AssignmentFormValues {
  assignment: Assignment
  assignmentGroups: AssignmentGroup[]
  semesterDisciplineId: ID
  assignmentResponse?: Assignment
}

interface AssignmentFormContext {
  mode: FormMode
  values: AssignmentFormValues
  rules: AssignmentFormRules
  error: string
  success: string
}

export const assignmentContext = <AssignmentFormContext>{
  mode: FormMode.Creating,
  values: <AssignmentFormValues>{
    assignment: <any>{},
    assignmentGroups: [],
    semesterDisciplineId: '1',
  },
  rules: {
    titleRules: [(v: string) => !!v || 'Введите название задания'],
  },
  error: '',
  success: 'Задание создано',
}

type AssignmentFormEvent = { type: 'CREATE_ASSIGNMENT' }

class AssignmentFormMachine {
  @inject() assignmentService!: IAssignmentService
  public create () {
    return formMachine.withConfig({
      services: {
        onSubmit: (context: AssignmentFormContext, _event: any) => {
          assign({ error: () => '' })
          return this.assignmentService.createAssignment(
            context.values.assignment,
          )
        },
        onPreload: (context: AssignmentFormContext, _event: any) => {
          assign({ error: () => '' })
          return this.assignmentService.getAssignmentGroups(
            context.values.semesterDisciplineId,
          )
        },
      },
      actions: {
        onChange: assign({
          values: (context, event: any) => ({
            ...context.values,
            assignment: {
              ...context.values.assignment,
              [event.key]: event.value,
            },
          }),
        }),
        onPreloadDone: assign({
          values: (context, event: any) => ({
            ...context.values,
            assignmentGroups: event.data,
          }),
        }),
        onDone: assign({
          values: (context, event: any) => ({
            ...context.values,
            assignmentResponse: event.data,
          }),
        }),
        onError: assign({ error: (_context, event: any) => event.data }),
        onSuccess: send('CLOSE_FORM', { delay: 500 }),
      },
    })
  }
}

const assignmentFormMachine = new AssignmentFormMachine()
  .create()
  .withContext(assignmentContext)
export default assignmentFormMachine
