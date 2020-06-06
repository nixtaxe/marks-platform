import { computed } from '@vue/composition-api'

export default function useMarksTableMachine (machine: any) {
  const groupName = computed(() => machine.state.context.groupName)
  const headers = computed(() => machine.state.context.headers)
  const studentMarks = computed(() => machine.state.context.studentMarks)

  const isLoading = computed(() => machine.state.matches('loading'))
  const isLoaded = computed(() => machine.state.matches('loaded'))
  const isFailure = computed(() => machine.state.matches('failure'))

  const send = machine.send
  const sendRefresh = () => send('REFRESH')
  const getColor = (mark: number, bad = 5, good = 7, excellent = 10) => {
    if (mark <= bad) return 'red'
    else if (mark <= good) return 'yellow'
    else if (mark < excellent) return 'green'
    else if (mark === excellent) return 'teal darken-1'
  }
  return {
    groupName,
    headers,
    studentMarks,
    isLoading,
    isLoaded,
    isFailure,
    sendRefresh,
    getColor,
  }
}
