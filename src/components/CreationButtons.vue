<template>
  <v-layout
    row
    pa-5
  >
    <v-btn
      class="flat"
      :block="false"
      @click="sendOpenAssignmentForm()"
    >
      Добавить задание
    </v-btn>
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
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import AssignmentForm from './AssignmentForm.vue'
import useCreationButtonsMachine from '@/compositions/useCreationButtonsMachine'

@Component({
  components: {
    AssignmentForm,
  },
  setup (props: any) {
    return { ...useCreationButtonsMachine(props.creationButtonsMachine) }
  },
})
export default class CreationButtons extends Vue {
  @Prop() creationButtonsMachine: any
}
</script>
