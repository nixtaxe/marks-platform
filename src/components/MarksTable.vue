<template>
  <v-card>
    <v-card-title>
      Б8116-01.03.02
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
      :items="studentMarks"
      :search="search"
      :disable-pagination="true"
      :hide-default-footer="true"
      sort-by="name"
      item-key="name"
    />
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({})
export default class MarksTable extends Vue {
  search = ''
  headers = [
    {
      text: 'Студент',
      align: 'start',
      sortable: false,
      value: 'name',
    },
    { text: '18.05', sortable: false, value: 'mark1805' },
    { text: '19.05', sortable: false, value: 'mark1905' },
    { text: '20.05', sortable: false, value: 'mark2005' },
    { text: '21.05', sortable: false, value: 'mark2105' },
    { text: '22.05', sortable: false, value: 'mark2205' },
    { text: '23.05', sortable: false, value: 'mark2305' },
    { text: '24.05', sortable: false, value: 'mark2405' },
    { text: '25.05', sortable: false, value: 'mark2505' },
    { text: '26.05', sortable: false, value: 'mark2605' },
    { text: '27.05', sortable: false, value: 'mark2705' },
    { text: '28.05', sortable: false, value: 'mark2805' },
    { text: '29.05', sortable: false, value: 'mark2905' },
  ]

  studentMarks = [
    {
      id: 1,
      name: 'Иванов И.И.',
      mark1805: 0,
      mark1905: 5,
      mark2005: 4,
      mark2105: 4,
      mark2205: 4,
      mark2305: 4,
      mark2405: 4,
      mark2505: 4,
      mark2605: 4,
      mark2705: 4,
      mark2805: 4,
      mark2905: 4,
    },
    {
      id: 2,
      name: 'Степанов С.С.',
      mark1805: 0,
      mark1905: 5,
      mark2005: 4,
      mark2105: 4,
      mark2205: 4,
      mark2305: 4,
      mark2405: 4,
      mark2505: 4,
      mark2605: 4,
      mark2705: 4,
      mark2805: 4,
      mark2905: 4,
    },
    {
      id: 3,
      name: 'Александров А.А.',
      mark1805: 0,
      mark1905: 5,
      mark2005: 4,
      mark2105: 4,
      mark2205: 4,
      mark2305: 4,
      mark2405: 4,
      mark2505: 4,
      mark2605: 4,
      mark2705: 4,
      mark2805: 4,
      mark2905: 4,
    },
  ]
}
</script>
