import { computed } from '@vue/composition-api'

export default function useToolbarMachine (machine: any) {
  const name = computed(() => machine.state.context.user.name)

  const send = machine.send
  const sendLogout = () => send('LOGOUT')
  return { name, sendLogout }
}
