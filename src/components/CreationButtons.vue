<template>
  <v-row
    class="pa-5"
    align-content="space-around"
    justify="space-around"
  >
    <v-btn
      class="flat"
      :block="false"
      @click="sendOpenAssignmentGroupForm()"
    >
      + группа заданий
    </v-btn>
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
    <v-btn
      class="flat"
      :block="false"
      @click="sendOpenAssignmentForm()"
    >
      + задание
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
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import AssignmentForm from './AssignmentForm.vue'
import AssignmentGroupForm from './AssignmentGroupForm.vue'
import useCreationButtonsMachine from '@/compositions/useCreationButtonsMachine'

@Component({
  components: {
    AssignmentForm,
    AssignmentGroupForm,
  },
  setup (props: any) {
    return { ...useCreationButtonsMachine(props.creationButtonsMachine) }
  },
})
export default class CreationButtons extends Vue {
  @Prop() creationButtonsMachine: any
}
</script>
