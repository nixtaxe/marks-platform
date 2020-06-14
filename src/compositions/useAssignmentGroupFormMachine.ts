import { watch, ref } from '@vue/composition-api'
import useFormMachine from './useFormMachine'

export default function useAssignmentFormMachine (machine: any) {
  var name = ref('')
  var percentage = ref(0.0)

  const formData = useFormMachine(machine)

  watch(formData.isShowing, (value) => {
    if (value) {
      name.value = machine.state.context.values.assignmentGroup.name
      percentage.value = machine.state.context.values.assignmentGroup.percentage
    }
  })

  return {
    ...formData,
    name,
    percentage,
    nameRules: machine.state.context.rules.nameRules,
  }
}
