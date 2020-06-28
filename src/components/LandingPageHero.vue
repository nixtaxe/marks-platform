<template>
  <v-container
    fluid
    class="background"
    style="height: 100%; max-height: 100vh;"
    align="center"
    justify="center"
  >
    <v-row
      align="center"
      justify="center"
      style="width: 100vw; height: 100%;"
    >
      <v-col
        justify="center"
        align="center"
        pa-5
      >
        <template v-if="isMobile">
          <div class="display-1 font-weight-black primary--text text-xs-center">
            ПЛАТФОРМА
          </div>
          <div class="display-1 font-weight-black primary--text text-xs-center">
            ДЛЯ
          </div>
          <div class="display-1 font-weight-black primary--text text-xs-center">
            ВЫСТАВЛЕНИЯ
          </div>
          <div
            class="display-1 font-weight-black primary--text text-xs-center mb-10"
          >
            ОЦЕНОК
          </div>
          <div class="title font-weight-bold primary--text text-xs-center">
            Всё для удобства
          </div>
          <div class="title font-weight-bold primary--text text-xs-center mb-3">
            преподавателей и студентов.
          </div>
        </template>
        <template v-else>
          <div class="display-4 font-weight-black primary--text text-xs-center">
            ПЛАТФОРМА ДЛЯ
          </div>
          <div class="display-4 font-weight-black primary--text text-xs-center">
            ВЫСТАВЛЕНИЯ
          </div>
          <div
            class="display-4 font-weight-black primary--text text-xs-center mb-3"
          >
            ОЦЕНОК
          </div>
          <div class="display-1 font-weight-bold primary--text text-xs-center">
            Всё для удобства преподавателей и студентов.
          </div>
        </template>
        <v-btn
          fab
          class="mt-5 primary"
          @click="sendOpenLoginForm()"
        >
          <v-icon
            large
            color="white"
          >
            mdi-exit-to-app
          </v-icon>
        </v-btn>
        <v-dialog
          max-width="480px"
          max-height="320px"
          :value="isLoginForm"
          :persistent="isPersistent"
          @input="sendCloseLoginForm()"
        >
          <LoginForm
            v-if="isLoginForm"
            :login-form-machine="loginFormMachine"
          />
        </v-dialog>
      </v-col>
    </v-row>
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

//
<style lang="scss" scoped>
// .landing-page-hero {
//   background: #d9dee2;
//   width: 100%;
//   height: 100%;
// }
//
</style>
