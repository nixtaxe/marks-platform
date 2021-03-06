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
          required
          :hint="percentageHint"
          :persistent-hint="true"
          :rules="percentageRules"
          :disabled="!isEditing"
          :append-icon="percentIcon"
          @keypress="checkKey($event)"
          @change="sendChange({ key: 'percentage', value: +percentage })"
        />
        <v-select
          v-model="selectedIntegrationType"
          :rules="integrationTypeRules"
          required
          :items="integrationTypes"
          :disabled="!isEditing"
          name="item"
          item-text="name"
          item-value="id"
          label="Тип интеграции"
          @change="
            sendChange({
              key: 'integration_type',
              value: selectedIntegrationType,
            })
          "
        />
        <v-select
          v-model="selectedMarksConstraint"
          :rules="marksConstraintRules"
          required
          :items="marksConstraints"
          :disabled="!isEditing"
          name="item"
          item-text="name"
          item-value="id"
          label="Тип оценки по умолчанию"
          @change="
            sendChange({
              key: 'default_marks_constraint',
              value: selectedMarksConstraint,
            })
          "
        />
        <div v-if="isIntegration">
          <v-text-field
            v-model="integrationUrl"
            name="integrationUrl"
            label="Ссылка на данные"
            :disabled="!isEditing"
            @change="
              sendChange({
                key: 'integrationUrl',
                value: integrationUrl,
              })
            "
          />
          <div v-if="isGoogleSpreadsheet">
            <v-text-field
              v-model="sheetName"
              name="sheetName"
              label="Название листа"
              :disabled="!isEditing"
              @change="
                sendChange({
                  key: 'sheetName',
                  value: sheetName,
                })
              "
            />
            <v-text-field
              v-model="upperLeftCell"
              name="upperLeftCell"
              label="Ячейка верхнего левого угла таблицы"
              :disabled="!isEditing"
              @change="
                sendChange({
                  key: 'upperLeftCell',
                  value: upperLeftCell,
                })
              "
            />
            <v-text-field
              v-model="lowerRightCell"
              name="lowerRightCell"
              label="Ячейка нижнего правого угла таблицы"
              :disabled="!isEditing"
              @change="
                sendChange({
                  key: 'lowerRightCell',
                  value: lowerRightCell,
                })
              "
            />
          </div>
        </div>

        <FormActions
          v-if="canEdit"
          :is-editing="isEditing"
          :is-showing="isShowing"
          :is-submitting="isSubmitting"
          :can-refresh-import="canRefreshImport"
          :is-refreshing="isRefreshing"
          :send-edit="sendEdit"
          :send-delete="sendDelete"
          :send-refresh-import="sendRefreshImport"
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
import { mdiPercentOutline } from '@mdi/js'

import useAssignmentGroupFormMachine from '@/compositions/useAssignmentGroupFormMachine'

@Component({
  components: {
    FormActions,
  },
  setup (props: any) {
    return {
      ...useAssignmentGroupFormMachine(props.assignmentGroupFormMachine),
    }
  },
})
export default class AssignmentGroupForm extends Vue {
  @Prop() assignmentGroupFormMachine: any
  percentIcon = mdiPercentOutline
}
</script>
