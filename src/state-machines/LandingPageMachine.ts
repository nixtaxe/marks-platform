import { Machine } from 'xstate'
import landingPageHeroMachine from '@/state-machines/LandingPageHeroMachine'

const landingPageMachine = Machine({
  id: 'landingPage',
  initial: 'landingPageHero',
  states: {
    landingPageHero: {
      invoke: {
        id: 'landingPageHeroMachine',
        src: landingPageHeroMachine,
      },
    },
  },
})

export default landingPageMachine
