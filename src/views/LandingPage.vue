<template>
  <span>
    <LandingPageHero :landing-page-hero-machine="landingPageHeroMachine" />
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import LandingPageHero from '@/components/LandingPageHero.vue'
import useLandingPageMachine from '@/compositions/useLandingPageMachine'

@Component({
  components: {
    LandingPageHero,
  },
  setup () {
    return { ...useLandingPageMachine() }
  },
})
export default class LandingPage extends Vue {}
</script>
