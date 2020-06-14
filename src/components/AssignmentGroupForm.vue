<template>
  <v-card v-if="wasPreloaded">
    <v-card-title>
      Группа заданий
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
          v-model="name"
          name="name"
          label="Название группы заданий"
          required
          :rules="nameRules"
          :autofocus="true"
          :disabled="!isEditing"
          @change="sendChange({ key: 'name', value: name })"
        />
        <v-text-field
          v-model="percentage"
          name="percentage"
          label="Вес оценки в процентах"
          :disabled="true"
        />
        <v-card-actions>
          <v-spacer />
          <v-btn
            v-if="isEditing"
            x-large
            min-width="150px"
            color="primary"
            type="submit"
            :loading="isSubmitting"
          >
            Сохранить
          </v-btn>
          <v-btn
            v-if="isShowing"
            x-large
            min-width="150px"
            color="primary"
            @click="sendEdit()"
          >
            Редактировать
          </v-btn>
          <v-btn
            v-if="isShowing"
            x-large
            min-width="150px"
            color="primary"
            @click="sendDelete()"
          >
            Удалить
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import useAssignmentGroupFormMachine from '@/compositions/useAssignmentGroupFormMachine'

@Component({
  setup (props: any) {
    return {
      ...useAssignmentGroupFormMachine(props.assignmentGroupFormMachine),
    }
  },
})
export default class AssignmentGroupForm extends Vue {
  @Prop() assignmentGroupFormMachine: any
}
</script>
