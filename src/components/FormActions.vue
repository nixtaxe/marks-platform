<template>
  <v-card-actions>
    <v-spacer />
    <v-btn
      v-if="isEditing"
      color="primary"
      type="submit"
      fab
      text
      :loading="isSubmitting"
    >
      <v-icon
        large
        dark
      >
        {{ saveIcon }}
      </v-icon>
    </v-btn>
    <v-btn
      v-if="isShowing"
      color="primary"
      fab
      text
      @click="sendEdit()"
    >
      <v-icon
        large
        dark
      >
        {{ editIcon }}
      </v-icon>
    </v-btn>
    <v-btn
      v-if="isShowing"
      color="grey"
      fab
      text
      @click="sendDelete()"
    >
      <v-icon
        large
        dark
      >
        {{ deleteIcon }}
      </v-icon>
    </v-btn>
    <v-btn
      v-if="canRefreshImport"
      color="primary"
      fab
      text
      @click="sendRefreshImport()"
    >
      <v-icon
        dark
        large
        :loading="isRefreshing"
      >
        {{ refreshImportIcon }}
      </v-icon>
    </v-btn>
    <v-spacer />
  </v-card-actions>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { mdiCloudRefresh } from '@mdi/js'
import { mdiDelete } from '@mdi/js'
import { mdiPencil } from '@mdi/js'
import { mdiContentSave } from '@mdi/js'

@Component({})
export default class AssignmentForm extends Vue {
  @Prop({ default: false }) isEditing!: boolean
  @Prop({ default: true }) isShowing!: boolean
  @Prop({ default: false }) isSubmitting!: boolean
  @Prop({ default: false }) canRefreshImport!: boolean
  @Prop({ default: false }) isRefreshing!: boolean
  @Prop({ default: () => {} }) sendEdit!: Function
  @Prop({ default: () => {} }) sendDelete!: Function
  @Prop({ default: () => {} }) sendRefreshImport!: Function

  refreshImportIcon = mdiCloudRefresh
  deleteIcon = mdiDelete
  editIcon = mdiPencil
  saveIcon = mdiContentSave
}
</script>
