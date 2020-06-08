import { ref, computed, watch } from '@vue/composition-api'

export default function useToolbarMachine (machine: any) {
  const user = machine.state.context.user
  const name = `${user.familyName} ${user.name[0]}.${user.patronymic[0]}.`

  const selectSemesterDiscipline = ref('')
  const searchSemesterDiscipline = ref('')
  const loading = computed(() => machine.state.matches('loading'))
  const items = computed(
    () => machine.state.context.filteredSemesterDisciplines,
  )

  watch(searchSemesterDiscipline, (value) => {
    if (value && value !== selectSemesterDiscipline.value) {
      sendSearchSemesterDiscipline(value)
    }
  })

  const send = machine.send
  const sendLogout = () => send('LOGOUT')
  const sendSearchSemesterDiscipline = (searchValue: string) =>
    send({ type: 'SEARCH_SEMESTER_DISCIPLINE', searchValue })
  const sendSelectSemesterDiscipline = (event: any) =>
    send({ type: 'SELECT_SEMESTER_DISCIPLINE', id: event.value })
  return {
    name,
    selectSemesterDiscipline,
    searchSemesterDiscipline,
    loading,
    items,
    sendLogout,
    sendSelectSemesterDiscipline,
  }
}
