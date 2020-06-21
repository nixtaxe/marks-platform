import { computed, watch, ref } from '@vue/composition-api'
import useFormMachine from './useFormMachine'

export default function useAssignmentFormMachine (machine: any) {
  const assignmentGroups = computed(
    () => machine.state.context.values.assignmentGroups,
  )
  const marksConstraints = computed(
    () => machine.state.context.values.marksConstraints,
  )
  const title = ref('')
  const deadlineDate = ref('')
  const selectedAssignmentGroup = ref(null)
  const selectedMarksConstraint = ref(null)

  const formData = useFormMachine(machine)
  const onPickDeadlineDate = (save: Function, deadlineDate: string) => {
    save(deadlineDate)
    formData.sendChange({ key: 'deadlineDate', value: deadlineDate })
  }

  watch(formData.isShowing, (value) => {
    if (value) {
      title.value = machine.state.context.values.assignment.title
      deadlineDate.value = machine.state.context.values.assignment.deadlineDate
      selectedAssignmentGroup.value =
        machine.state.context.values.assignment.assignment_group.id
      selectedMarksConstraint.value =
        machine.state.context.values.assignment.marks_constraint.id
    }
  })

  return {
    ...formData,
    assignmentGroups,
    marksConstraints,
    title,
    deadlineDate,
    selectedAssignmentGroup,
    selectedMarksConstraint,
    titleRules: machine.state.context.rules.titleRules,
    assignmentGroupRules: machine.state.context.rules.assignmentGroupRules,
    marksConstraintRules: machine.state.context.rules.marksConstraintRules,
    onPickDeadlineDate,
  }
}
