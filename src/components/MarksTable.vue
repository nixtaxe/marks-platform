<template>
  <v-card>
    <v-card-title v-if="isLoaded">
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
      :loading="isLoading"
      :headers="headers"
      :items="studentMarks"
      :search="search"
      :disable-pagination="true"
      :hide-default-footer="true"
      sort-by="name"
      item-key="id"
    >
      <template v-slot:item.19.05="props">
        <v-edit-dialog :return-value.sync="props.item['19.05']">
          {{ props.item['19.05'] }}
          <template v-slot:input>
            <v-text-field
              v-model="props.item['19.05']"
              label="Edit"
              single-line
              counter
            />
          </template>
        </v-edit-dialog>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import useMarksTableMachine from '@/compositions/useMarksTableMachine'

@Component({
  setup (props: any) {
    return { ...useMarksTableMachine(props.marksTableMachine) }
  },
})
export default class MarksTable extends Vue {
  @Prop() marksTableMachine: any
  search = ''
}
</script>
