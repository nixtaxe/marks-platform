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
      fixed-header
      sort-by="name"
      item-key="id"
    >
      <template
        v-for="header in headers"
        v-slot:[`item.${header.value}`]="{ item }"
      >
        <v-edit-dialog
          :key="`${item.id}-${header.value}`"
          :return-value.sync="item[header.value]"
        >
          <v-chip
            v-if="!isNaN(item[header.value])"
            label
            :color="getColor(+item[header.value])"
            dark
          >
            {{ item[header.value] }}
          </v-chip>
          <div v-if="isNaN(item[header.value])">
            {{ item[header.value] }}
          </div>
          <template v-slot:input>
            <tr>
              <td>0 &lt;</td>
              <v-spacer />
              <v-text-field
                v-model="item[header.value]"
                class="px-3"
                label="Edit"
                single-line
                width="25px"
              />
              <v-spacer />
              <td>&lt; 10</td>
            </tr>
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
