<template>
  <v-card>
    <v-card-title>
      {{ groupName }}
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Поиск студента"
        single-line
        hide-details
      />
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :disable-pagination="true"
      :hide-default-footer="true"
      sort-by="name"
      item-key="id"
    />
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import getMarksDataForTable from '@/helpers/getMarksDataForTable'
import groupMarks from '@/mock/data/group-marks/index.json'

@Component({
  setup () {
    return { ...getMarksDataForTable(groupMarks) }
  },
})
export default class MarksTable extends Vue {
  search = ''
}
</script>
