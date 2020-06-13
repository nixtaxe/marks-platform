import { assign, send } from 'xstate'
import Assignment from '@/models/Assignment'
import formMachine, { FormMode } from './FormMachine'
import { inject } from 'inversify-props'
import IAssignmentService from '@/services/IAssignmentService'
import AssignmentGroup from '@/models/AssignmentGroup'
import ID from '@/models/ID'

interface AssignmentFormRules {
  titleRules: Function[]
  assignmentGroupRules: Function[]
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
    marksConstraints: [],
    semesterDisciplineId: '1',
  },
  rules: {
    titleRules: [(v: string) => !!v || 'Введите название задания'],
    assignmentGroupRules: [(v: string) => !!v || 'Выберите группу для задания'],
    marksConstraintRules: [(v: string) => !!v || 'Выберите тип оценки'],
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
        onSubmit: (context: AssignmentFormContext, event: any) => {
          assign({ error: () => '' })
          if (event.type === 'DELETE')
            return this.assignmentService.deleteAssignment(
              context.values.assignment.id,
            )
          else if ('id' in context.values.assignment)
            return this.assignmentService.updateAssignment(
              context.values.assignment,
            )
          else
            return this.assignmentService.createAssignment(
              context.values.assignment,
            )
        },
        onPreload: (context: AssignmentFormContext, _event: any) => {
          assign({ error: () => '' })
          if (context.mode === FormMode.Showing)
            return this.assignmentService.getAssignment(
              context.values.assignment.id,
            )
          else
            return this.assignmentService.getAssignmentSelections(
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
          values: (context, event: any) => {
            if (context.mode === FormMode.Showing)
              return {
                ...context.values,
                assignment: event.data,
                assignmentGroups: [event.data.assignment_group],
                marksConstraints: [event.data.marks_constraint],
              }
            else
              return {
                ...context.values,
                assignmentGroups: event.data.assignmentGroups,
                marksConstraints: event.data.marksConstraints,
              }
          },
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

const getAssignmentFormMachine = () =>
  new AssignmentFormMachine().create().withContext(assignmentContext)

export default getAssignmentFormMachine
