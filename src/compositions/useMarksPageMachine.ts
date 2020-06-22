import { useMachine } from '@xstate/vue'
import marksPageMachine from '@/state-machines/MarksPageMachine'
import { computed, watch } from '@vue/composition-api'

export default function useMarksPageMachine (id: string, userId: string) {
  const { state, send } = useMachine(marksPageMachine)
  const isLoaded = computed(() => state.value.matches('loaded.main'))
  const toolbarMachine = computed(() => state.value.children.toolbarMachine)
  const marksTableMachine = computed(
    () => state.value.children.marksTableMachine,
  )
  const creationButtonsMachine = computed(
    () => state.value.children.creationButtonsMachine,
  )
  const canEdit = computed(() => state.value.context.canEdit)

  watch(state, (value, oldValue) => {
    if (
      oldValue &&
      value &&
      oldValue.matches('loading') &&
      value.matches('loaded')
    ) {
      if (id !== '' && userId !== '') {
        send({ type: 'SELECT_SEMESTER_DISCIPLINE', id, userId })
      }
    }
  })

  return {
    isLoaded,
    canEdit,
    toolbarMachine,
    marksTableMachine,
    creationButtonsMachine,
  }
}
