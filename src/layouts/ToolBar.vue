<template>
  <v-toolbar
    short
    color="primary"
  >
    <v-spacer />
    <v-btn @click="logout()">
      Выйти
    </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import IUserService from '../services/IUserService'
import { inject } from 'inversify-props'

@Component({})
export default class ToolBar extends Vue {
  @inject() userService!: IUserService
  public logout () {
    this.userService.logout()
    location.reload()
  }
}
</script>
