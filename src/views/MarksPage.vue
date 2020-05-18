<template>
  <ToolBar
    v-if="isLoaded"
    :toolbar-machine="toolbarMachine"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ToolBar from '@/layouts/ToolBar.vue'
import useMarksPageMachine from '../compositions/useMarksPageMachine'

@Component({
  components: {
    ToolBar,
  },
  setup () {
    return useMarksPageMachine()
  },
})
export default class MarksPage extends Vue {}
</script>
