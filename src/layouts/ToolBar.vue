<template>
  <v-toolbar
    dark
    color="blue darken-3"
  >
    <v-autocomplete
      v-model="selectSemesterDiscipline"
      :loading="loading"
      :items="items"
      :filter="filterSemesterDisciplines"
      :clearable="true"
      solo-inverted
      flat
      hide-details
      cache-items
      clear-icon="mdi-clear"
      label="Найти журнал оценок"
      dense
      return-object
      @input="sendSelectSemesterDiscipline($event)"
    />
    <v-toolbar-title
      v-if="!isMobile"
      class="white--text mx-5"
    >
      {{ name }}
    </v-toolbar-title>
    <v-btn
      fab
      small
      text
      class="flat blue darken-3"
      @click="sendLogout()"
    >
      <v-icon dark>
        {{ logoutIcon }}
      </v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import useToolbarMachine from '@/compositions/useToolbarMachine'
import { mdiLogoutVariant } from '@mdi/js'

@Component({
  setup (props: any, ctx: any) {
    return useToolbarMachine(props.toolbarMachine, ctx.root.$router)
  },
})
export default class ToolBar extends Vue {
  @Prop() toolbarMachine: any
  logoutIcon = mdiLogoutVariant
}
</script>
