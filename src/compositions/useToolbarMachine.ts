import { ref, computed } from '@vue/composition-api'
import SemesterDiscipline from '@/models/SemesterDiscipline'
import useIsMobileCheck from './useIsMobileCheck'

export default function useToolbarMachine (machine: any, router: any) {
  const user = machine.state.context.user
  const name = `${user.familyName} ${user.name[0]}.${user.patronymic[0]}.`

  const selectSemesterDiscipline = ref('')
  const loading = computed(() => machine.state.matches('loading'))
  const items = computed(
    () => machine.state.context.filteredSemesterDisciplines,
  )
  const relevantSemesterDisciplines = computed(
    () => machine.state.context.relevantSemesterDisciplines,
  )
  const userRole = machine.state.context.user.role.name
  const isTeacher = userRole === 'Преподаватель'
  const isStudent = userRole === 'Студент'

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
  const sendSelectSemesterDiscipline = ($event: any) => {
    if (!$event) return
    const userId = machine.state.context.rawSemesterDisciplines.find(
      (x: SemesterDiscipline) => x.id === $event.value,
    )?.teacher_discipline_student_group.teacher.user.id
    router
      .push({
        name: 'semester-discipline',
        params: { id: $event.value, userId },
      })
      .catch((_err: any) => {})
    send({ type: 'SELECT_SEMESTER_DISCIPLINE', id: $event.value })
  }

  const mobileCheck = useIsMobileCheck()
  const hasDrawer = !mobileCheck.isMobile.value

  return {
    name,
    selectSemesterDiscipline,
    filterSemesterDisciplines,
    relevantSemesterDisciplines,
    isTeacher,
    isStudent,
    loading,
    items,
    ...useIsMobileCheck(),
    hasDrawer,
    sendLogout,
    sendSelectSemesterDiscipline,
  }
}
