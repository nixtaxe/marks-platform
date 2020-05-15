import landingPageMachine from '@/state-machines/LandingPageMachine'
import { useMachine } from '@xstate/vue'
import { computed } from '@vue/composition-api'

export default function useLandingPageMachine () {
  const { state, send, service } = useMachine(landingPageMachine)
  const landingPageHeroMachine = computed(
    () => service.state.children.landingPageHeroMachine,
  )

  const sendOpenWelcomePage = () => send('OPEN_WELCOME_PAGE')
  return { state, send, landingPageHeroMachine, sendOpenWelcomePage }
}
