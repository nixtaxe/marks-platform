<template>
  <div
    style="height: 100%;"
    class="background"
  >
    <ToolBar
      v-if="isLoaded"
      :toolbar-machine="toolbarMachine"
    />
    <v-col
      v-if="isLoaded"
      align-self="start"
      class="pa-6"
    >
      <MarksTable :marks-table-machine="marksTableMachine" />
      <CreationButtons
        v-if="canEdit"
        :creation-buttons-machine="creationButtonsMachine"
      />
    </v-col>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ToolBar from '@/layouts/ToolBar.vue'
import MarksTable from '@/components/MarksTable.vue'
import CreationButtons from '@/components/CreationButtons.vue'
import useMarksPageMachine from '../compositions/useMarksPageMachine'
import { Prop } from 'vue-property-decorator'

@Component({
  components: {
    ToolBar,
    MarksTable,
    CreationButtons,
  },
  setup (props: any) {
    return useMarksPageMachine(props.id, props.userId)
  },
})
export default class MarksPage extends Vue {
  @Prop({ default: '' }) id!: string
  @Prop({ default: '' }) userId!: string
}
</script>
