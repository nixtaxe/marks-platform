<template>
  <div>
    <ToolBar
      v-if="isLoaded"
      :toolbar-machine="toolbarMachine"
    />
    <v-layout
      v-if="isLoaded"
      column
      pa-5
    >
      <MarksTable :marks-table-machine="marksTableMachine" />
      <CreationButtons
        v-if="canEdit"
        :creation-buttons-machine="creationButtonsMachine"
      />
    </v-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ToolBar from '@/layouts/ToolBar.vue'
import MarksTable from '@/components/MarksTable.vue'
import CreationButtons from '@/components/CreationButtons.vue'
import useMarksPageMachine from '../compositions/useMarksPageMachine'

@Component({
  components: {
    ToolBar,
    MarksTable,
    CreationButtons,
  },
  setup () {
    return useMarksPageMachine()
  },
})
export default class MarksPage extends Vue {}
</script>
