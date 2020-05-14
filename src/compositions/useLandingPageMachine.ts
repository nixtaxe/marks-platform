import landingPageMachine from '@/state-machines/LandingPageMachine'
import { useMachine } from '@xstate/vue'
import { ref } from '@vue/composition-api'

export default function useLandingPageMachine () {
  const { state, send, service } = useMachine(landingPageMachine)
  const landingPageHeroMachine = ref(
    service.state.children.landingPageHeroMachine,
  )
  const sendOpenWelcomePage = () => send('OPEN_WELCOME_PAGE')
  return { state, send, landingPageHeroMachine, sendOpenWelcomePage }
}
