<template>
  <ToolBar />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ToolBar from '@/layouts/ToolBar.vue'

@Component({
  components: {
    ToolBar,
  },
})
export default class MarksPage extends Vue {}
</script>
