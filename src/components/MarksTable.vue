<template>
  <v-card>
    <v-card-title>
      {{ groupName || 'Номер группы' }}
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
      <template v-slot:header>
        <thead>
          <tr>
            <th />
            <th
              v-for="ag in assignmentGroups"
              :key="ag.id"
              :colspan="ag.width"
              class="title"
            >
              {{ ag.text }}
            </th>
          </tr>
        </thead>
      </template>
      <template
        v-for="header in headers"
        v-slot:[`item.${header.value}`]="{ item }"
      >
        <div
          v-if="header.value === 'name'"
          :key="`${item.id}-${header.value}`"
        >
          {{ item[header.value].value }}
        </div>
        <v-edit-dialog
          v-else
          :key="`${item.id}-${header.value}`"
          :return-value.sync="item[header.value].value"
          @save="performMutation(item[header.value], item.id, header.value)"
        >
          <div
            v-if="
              isNaN(item[header.value].value) || item[header.value].value === ''
            "
          >
            {{ item[header.value].value }}
          </div>
          <v-chip
            v-else
            label
            :color="getColor(+item[header.value].value)"
            dark
          >
            {{ item[header.value].value }}
          </v-chip>
          <template v-slot:input>
            <tr>
              <td>0 &lt;</td>
              <v-spacer />
              <v-text-field
                v-model="item[header.value].value"
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
