import { computed } from '@vue/composition-api'

export default function useMarksTableMachine (machine: any) {
  const groupName = computed(() => machine.state.context.marksTable.groupName)
  const headers = computed(() => machine.state.context.headers)
  const studentMarks = computed(() => machine.state.context.studentMarks)

  const isLoading = computed(() => machine.state.matches('loading'))
  const isLoaded = computed(() => machine.state.matches('loaded'))
  const isFailure = computed(() => machine.state.matches('failure'))

  const send = machine.send
  const sendRefresh = () => send('REFRESH')

  return {
    groupName,
    headers,
    studentMarks,
    isLoading,
    isLoaded,
    isFailure,
    sendRefresh,
  }
}
