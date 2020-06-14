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
      :custom-filter="filterByName"
      :disable-pagination="true"
      :hide-default-footer="true"
      fixed-header
      hide-default-header
      sort-by="name"
      item-key="id"
    >
      <template v-slot:header="{ props: { headers } }">
        <thead>
          <tr>
            <th />
            <th
              v-for="assignmentGroup in assignmentGroups"
              :key="assignmentGroup.id"
              :colspan="assignmentGroup.width || 1"
              class="subtitle-2"
            >
              {{ assignmentGroup.text }}
            </th>
          </tr>
          <tr>
            <th
              v-for="header in headers"
              :key="header.value"
              @click="sendOpenAssignmentForm(header.value)"
            >
              {{ header.text }}
            </th>
            <v-dialog
              max-width="480px"
              max-height="320px"
              :value="isAssignmentForm"
              :persistent="isPersistentAssignmentForm"
              @input="sendCloseAssignmentForm()"
            >
              <AssignmentForm
                v-if="isAssignmentForm"
                :assignment-form-machine="assignmentFormMachine"
              />
            </v-dialog>
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
            :color="getColor(+item[header.value].value, header)"
            dark
          >
            {{
              header.marks_constraint.maxValue === 100
                ? (+item[header.value].value).toFixed(2)
                : item[header.value].value
            }}
          </v-chip>
          <template
            v-if="header.editable"
            v-slot:input
          >
            <tr>
              <td>{{ header.marks_constraint.minValue }} &lt;=</td>
              <v-spacer />
              <v-text-field
                v-model="item[header.value].value"
                class="px-3"
                label="Оценка"
                single-line
                width="25px"
                @keypress="checkKey($event, header.marks_constraint)"
              />
              <v-spacer />
              <td>&lt;= {{ header.marks_constraint.maxValue }}</td>
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
import AssignmentForm from '@/components/AssignmentForm.vue'

@Component({
  components: {
    AssignmentForm,
  },
  setup (props: any) {
    return { ...useMarksTableMachine(props.marksTableMachine) }
  },
})
export default class MarksTable extends Vue {
  @Prop() marksTableMachine: any
  search = ''
}
</script>
