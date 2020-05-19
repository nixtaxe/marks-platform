<template>
  <v-toolbar class="indigo">
    <v-spacer />
    <v-toolbar-title class="white--text mr-5">
      {{ name }}
    </v-toolbar-title>
    <v-btn
      class="flat mr-5"
      @click="sendLogout()"
    >
      Выйти
    </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import useToolbarMachine from '@/compositions/useToolbarMachine'

@Component({
  setup (props: any) {
    return useToolbarMachine(props.toolbarMachine)
  },
})
export default class ToolBar extends Vue {
  @Prop() toolbarMachine: any
}
</script>
