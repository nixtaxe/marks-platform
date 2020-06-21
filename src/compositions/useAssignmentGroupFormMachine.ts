import { watch, ref } from '@vue/composition-api'
import useFormMachine from './useFormMachine'

export default function useAssignmentFormMachine (machine: any) {
  var name = ref('')
  var percentage = ref(0.0)
  const maxAvailablePercentage = ref(0.0)
  const percentageHint = ref('')

  const formData = useFormMachine(machine)

  watch(formData.isShowing, (value) => {
    if (value) {
      name.value = machine.state.context.values.assignmentGroup.name
      percentage.value = machine.state.context.values.assignmentGroup.percentage
      maxAvailablePercentage.value =
        machine.state.context.values.remainingPercentages + percentage.value
      percentageHint.value = `Максимальный вес для этой группы = ${maxAvailablePercentage.value}%`
    }
  })

  const checkKey = ($event: any) => {
    const resultValue = $event.target.value + $event.key
    const parsedValue = parseFloat(resultValue)
    if (
      isNaN(resultValue) ||
      parsedValue < 0 ||
      parsedValue > +maxAvailablePercentage.value
    ) {
      $event.preventDefault()
    }
  }

  return {
    ...formData,
    name,
    percentage,
    percentageHint,
    nameRules: machine.state.context.rules.nameRules,
    percentageRules: machine.state.context.rules.percentageRules,
    checkKey,
  }
}
