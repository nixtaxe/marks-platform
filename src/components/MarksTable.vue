<template>
  <v-card>
    <v-card-title>
      {{ disciplineName || 'Название дисциплины' }}
    </v-card-title>
    <v-card-subtitle>
      {{ groupName || 'Группа' }}
      {{ startDate || 'Дата начала предмета' }}
      <v-spacer />
      {{ teacherFullName || 'Преподаватель' }}
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Поиск студента"
        single-line
        hide-details
      />
    </v-card-subtitle>
    <v-card-subtitle>
      <v-row>
        <v-select
          v-model="nameFormat"
          :items="nameFormats"
          label="Формат имен студентов"
          style="max-width: 200px;"
          class="mx-5"
          dense
          @change="sendSelectNameFormat(nameFormat)"
        />
        <v-select
          v-if="!isMobile"
          v-model="assignmentFormat"
          :items="assignmentFormats"
          label="Формат заголовков заданий"
          style="max-width: 250px;"
          class="mx-5"
          dense
          @change="sendSelectAssignmentFormat(assignmentFormat)"
        />
        <v-spacer />
      </v-row>
    </v-card-subtitle>
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
      <template
        v-if="!isMobile"
        v-slot:header="{ props: { headers } }"
      >
        <thead>
          <tr>
            <th />
            <th
              v-for="assignmentGroup in assignmentGroups"
              :key="assignmentGroup.id"
              :colspan="assignmentGroup.width || 1"
              class="subtitle-2"
              @click="sendOpenAssignmentGroupForm(assignmentGroup.id)"
            >
              {{
                assignmentGroup.text + ' ' + assignmentGroup.percentage + '%'
              }}
            </th>
            <v-dialog
              max-width="480px"
              max-height="320px"
              :value="isAssignmentGroupForm"
              :persistent="isPersistentAssignmentGroupForm"
              @input="sendCloseAssignmentGroupForm()"
            >
              <AssignmentGroupForm
                v-if="isAssignmentGroupForm"
                :assignment-group-form-machine="assignmentGroupFormMachine"
              />
            </v-dialog>
          </tr>
          <tr>
            <th
              v-for="header in headers"
              :key="header.value"
              @click="
                header.editable ? sendOpenAssignmentForm(header.value) : null
              "
            >
              <v-tooltip
                v-if="isAssignmentPosition && header.isAssignment"
                top
              >
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on"
                  >{{
                    'position' in header ? header.position : header.text
                  }}</span>
                </template>
                <span>{{ header.text }}</span>
              </v-tooltip>
              <div v-else>
                {{ header.text }}
              </div>
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
          v-if="
            header.simple ||
              ((isNaN(item[header.value].value) ||
                item[header.value].value === '') &&
                !canEdit)
          "
          :key="`${item.id}-${header.value}`"
          style="min-width: 31px;"
        >
          {{ item[header.value].value }}
        </div>
        <v-chip
          v-else-if="!header.editable || !canEdit"
          :key="`${item.id}-${header.value}`"
          label
          :color="getColor(+item[header.value].value, header)"
          dark
          small
        >
          {{
            +item[header.value].value % 1 !== 0
              ? (+item[header.value].value).toFixed(2)
              : item[header.value].value
          }}
        </v-chip>
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
            style="min-width: 31px;"
          >
            {{ item[header.value].value }}
          </div>
          <v-chip
            v-else
            label
            :color="getColor(+item[header.value].value, header)"
            dark
            small
          >
            {{
              +item[header.value].value % 1 !== 0
                ? (+item[header.value].value).toFixed(2)
                : item[header.value].value
            }}
          </v-chip>
          <template v-slot:input>
            <!-- <v-row
              class="pa-3"
              justify="space-around"
            >
              <v-chip
                v-for="i in header.marks_constraint.maxValue + 1"
                :key="i"
                label
                :color="getColor(i-1, header)"
                dark
                small
              >
                {{ i-1 }}
              </v-chip>
            </v-row> -->
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
import AssignmentGroupForm from '@/components/AssignmentGroupForm.vue'

@Component({
  components: {
    AssignmentForm,
    AssignmentGroupForm,
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
