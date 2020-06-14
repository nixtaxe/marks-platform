import { ref, computed } from '@vue/composition-api'

export default function useToolbarMachine (machine: any) {
  const user = machine.state.context.user
  const name = `${user.familyName} ${user.name[0]}.${user.patronymic[0]}.`

  const selectSemesterDiscipline = ref('')
  const loading = computed(() => machine.state.matches('loading'))
  const items = computed(
    () => machine.state.context.filteredSemesterDisciplines,
  )

  const filterSemesterDisciplines = (
    item: any,
    queryText: string,
    itemText: string,
  ) => {
    const pieces = queryText.trim().split(' ')

    const lowerCaseText = (itemText || '').toLowerCase()
    const result = pieces.reduce(
      (acc: boolean, current: string) =>
        lowerCaseText.indexOf(current.toLowerCase()) > -1 && acc,
      true,
    )

    return result
  }

  const send = machine.send
  const sendLogout = () => send('LOGOUT')
  const sendSelectSemesterDiscipline = ($event: any) =>
    send({ type: 'SELECT_SEMESTER_DISCIPLINE', id: $event.value })
  return {
    name,
    selectSemesterDiscipline,
    filterSemesterDisciplines,
    loading,
    items,
    sendLogout,
    sendSelectSemesterDiscipline,
  }
}
