<template>
  <span>
    <LandingPageHero />
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import LandingPageHero from '@/components/LandingPageHero.vue'

@Component({
  components: {
    LandingPageHero,
  },
})
export default class LandingPage extends Vue {}
</script>
