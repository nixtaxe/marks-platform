import { useMachine } from '@xstate/vue'
import marksPageMachine from '@/state-machines/MarksPageMachine'
import { computed } from '@vue/composition-api'

export default function useMarksPageMachine () {
  const { state } = useMachine(marksPageMachine)
  const isLoaded = computed(() => state.value.matches('loaded.main'))
  const toolbarMachine = computed(() => state.value.children.toolbarMachine)
  const marksTableMachine = computed(
    () => state.value.children.marksTableMachine,
  )
  return { isLoaded, toolbarMachine, marksTableMachine }
}
