<template>
  <v-layout
    row
    pa-5
  >
    <v-btn
      class="flat"
      :block="false"
    >
      Добавить задание
    </v-btn>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({})
export default class CreationButtons extends Vue {}
</script>
