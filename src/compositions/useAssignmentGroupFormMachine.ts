import { watch, ref, computed } from '@vue/composition-api'
import useFormMachine from './useFormMachine'
import { IntegrationCodes } from '@/models/IntegrationType'

export default function useAssignmentFormMachine (machine: any) {
  const name = ref('')
  const percentage = ref(0.0)
  const integrationUrl = ref('')
  const sheetName = ref('')
  const upperLeftCell = ref('')
  const lowerRightCell = ref('')
  const maxAvailablePercentage = ref(0.0)
  const percentageHint = ref('')
  const selectedIntegrationType = ref(null)
  const selectedMarksConstraint = ref(null)
  const integrationTypes = computed(
    () => machine.state.context.values.integrationTypes,
  )
  const marksConstraints = computed(
    () => machine.state.context.values.marksConstraints,
  )

  const formData = useFormMachine(machine)

  const integrationType = computed(
    () => machine.state.context.values.assignmentGroup.integration_type,
  )

  const isIntegration = computed(
    () =>
      integrationType.value &&
      ((typeof integrationType.value === 'object' &&
        integrationType.value.code !== IntegrationCodes.NoIntegration) ||
        +integrationType.value !== IntegrationCodes.NoIntegration + 1),
  )
  const isGoogleSpreadsheet = computed(
    () =>
      integrationType.value &&
      ((typeof integrationType.value === 'object' &&
        integrationType.value.code ===
          IntegrationCodes.GoogleSpreadsheetsIntegraion) ||
        +integrationType.value ===
          IntegrationCodes.GoogleSpreadsheetsIntegraion + 1),
  )
  const canRefreshImport = computed(
    () => isIntegration.value && formData.isShowing,
  )

  watch(formData.isShowing, (value) => {
    if (value) {
      const ag = machine.state.context.values.assignmentGroup
      name.value = ag.name
      percentage.value = ag.percentage
      integrationUrl.value = ag.integrationUrl
      sheetName.value = ag.sheetName
      upperLeftCell.value = ag.upperLeftCell
      lowerRightCell.value = ag.lowerRightCell
      selectedIntegrationType.value = ag.integration_type.id
      selectedMarksConstraint.value = ag.default_marks_constraint.id
    }
  })

  watch(formData.wasPreloaded, (value, oldValue) => {
    if (oldValue !== undefined && value && oldValue !== value) {
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

  const sendRefreshImport = () => machine.send('REFRESH')

  return {
    ...formData,
    name,
    percentage,
    integrationUrl,
    sheetName,
    upperLeftCell,
    lowerRightCell,
    percentageHint,
    integrationTypes,
    marksConstraints,
    selectedIntegrationType,
    selectedMarksConstraint,
    isIntegration,
    isGoogleSpreadsheet,
    canRefreshImport,
    nameRules: machine.state.context.rules.nameRules,
    percentageRules: machine.state.context.rules.percentageRules,
    integrationTypeRules: machine.state.context.rules.integrationTypeRules,
    marksConstraintRules: machine.state.context.rules.marksConstraintRules,
    checkKey,
    sendRefreshImport,
  }
}
