<template>
  <v-container
    fluid
    fill-height
    class="landing-page-hero"
    style="max-height: 100vh;"
  >
    <v-layout
      justify-center
      align-center
      column
      pa-5
    >
      <div class="display-4 font-weight-black indigo--text text-xs-center">
        ПЛАТФОРМА ДЛЯ
      </div>
      <div class="display-4 font-weight-black indigo--text text-xs-center mb-3">
        ВЫСТАВЛЕНИЯ
      </div>
      <div class="display-4 font-weight-black indigo--text text-xs-center mb-3">
        ОЦЕНОК
      </div>
      <div class="display-1 font-weight-bold indigo--text text-xs-center">
        Всё для удобства преподавателей и студентов.
      </div>
      <v-btn
        fab
        class="mt-5 indigo"
      >
        <v-icon
          large
          color="white"
        >
          mdi-exit-to-app
        </v-icon>
      </v-btn>
      <v-dialog
        v-model="isLoginForm"
        max-width="480px"
        max-height="320px"
      >
        <LoginForm />
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import LoginForm from '@/components/LoginForm.vue'
import useLandingPageHeroMachine from '@/compositions/useLandingPageHeroMachine'

@Component({
  components: {
    LoginForm,
  },
  setup (props: any) {
    return { ...useLandingPageHeroMachine(props.landingPageHeroMachine) }
  },
})
export default class LandingPageHero extends Vue {
  @Prop() landingPageHeroMachine: any
}
</script>

<style lang="scss" scoped>
.landing-page-hero {
  background: #d9dee2;
  width: 100%;
  height: 100%;
}
</style>
