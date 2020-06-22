<template>
  <v-card v-if="wasPreloaded">
    <v-card-title>
      Задание
    </v-card-title>
    <v-card-text>
      <v-alert
        :value="isError"
        :outlined="true"
        type="error"
      >
        {{ context.error }}
      </v-alert>
      <v-alert
        :value="isSuccess"
        :outlined="true"
        type="success"
      >
        {{ context.success }}
      </v-alert>
      <v-form
        ref="form"
        @submit.prevent="onSubmit()"
      >
        <v-text-field
          v-model="title"
          name="title"
          label="Название задания"
          required
          :rules="titleRules"
          :autofocus="true"
          :disabled="!isEditing"
          @change="sendChange({ key: 'title', value: title })"
        />
        <v-dialog
          ref="deadlineMenu"
          v-model="deadlineMenu"
          :return-value.sync="deadlineDate"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="deadlineDate"
              label="День сдачи"
              readonly
              :disabled="!isEditing"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="deadlineDate"
            no-title
            scrollable
          >
            <v-spacer />
            <v-btn
              text
              color="primary"
              @click="deadlineMenu = false"
            >
              Отмена
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="onPickDeadlineDate($refs.deadlineMenu.save, deadlineDate)"
            >
              Выбрать
            </v-btn>
          </v-date-picker>
        </v-dialog>
        <v-select
          v-model="selectedAssignmentGroup"
          :rules="assignmentGroupRules"
          required
          :items="assignmentGroups"
          :disabled="!isEditing"
          name="item"
          item-text="name"
          item-value="id"
          label="Группа заданий"
          @change="
            sendChange({
              key: 'assignment_group',
              value: selectedAssignmentGroup,
            })
          "
        />
        <v-select
          v-model="selectedMarksConstraint"
          :items="marksConstraints"
          :disabled="!isEditing"
          name="item"
          item-text="name"
          item-value="id"
          label="Тип оценки"
          @change="
            sendChange({
              key: 'marks_constraint',
              value: selectedMarksConstraint,
            })
          "
        />
        <FormActions
          v-if="canEdit"
          :is-editing="isEditing"
          :is-showing="isShowing"
          :is-submitting="isSubmitting"
          :send-edit="sendEdit"
          :send-delete="sendDelete"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import FormActions from './FormActions.vue'

import useAssignmentFormMachine from '@/compositions/useAssignmentFormMachine'

@Component({
  components: {
    FormActions,
  },
  setup (props: any) {
    return { ...useAssignmentFormMachine(props.assignmentFormMachine) }
  },
})
export default class AssignmentForm extends Vue {
  @Prop() assignmentFormMachine: any
  deadlineMenu = false
}
</script>
