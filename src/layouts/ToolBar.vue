<template>
  <nav class="pa-3">
    <v-toolbar
      flat
      color="background"
    >
      <v-app-bar-nav-icon @click="hasDrawer = !hasDrawer" />
      <v-autocomplete
        v-model="selectSemesterDiscipline"
        :loading="loading"
        :items="items"
        :filter="filterSemesterDisciplines"
        clearable
        solo
        flat
        hide-details
        cache-items
        label="Найти журнал оценок"
        dense
        return-object
        @input="sendSelectSemesterDiscipline($event)"
      />
    </v-toolbar>
    <v-navigation-drawer
      v-model="hasDrawer"
      app
      color="white"
    >
      <v-list
        dense
        nav
        class="py-0"
      >
        <v-list-item
          two-line
          :class="true && 'px-0'"
        >
          <v-btn
            fab
            small
            text
            class="flat transparent"
            @click="sendLogout()"
          >
            <v-icon>
              {{ logoutIcon }}
            </v-icon>
          </v-btn>
          <v-list-item-content>
            <v-list-item-title>{{ name }}</v-list-item-title>
            <v-list-item-subtitle>Преподаватель</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider />
        <v-list-item>
          <v-list-item-title>Актуальные журналы оценок</v-list-item-title>
        </v-list-item>

        <v-list-group
          v-for="item in relevantSemesterDisciplines"
          :key="item.title"
          v-model="item.active"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="subItem in item.items"
            :key="subItem.title"
            class="pl-6"
            link
          >
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <!-- <v-list-item
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-content>
            <v-list-item-title wrap>
              {{ 'Методы дистанционного зондирования Земли ' }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ 'Иванов И.И.' }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{ 'Б8116-01.03.02' }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{ 'Весна 2020' }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item> -->
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import useToolbarMachine from '@/compositions/useToolbarMachine'
import { mdiLogoutVariant, mdiClose } from '@mdi/js'

@Component({
  setup (props: any, ctx: any) {
    return useToolbarMachine(props.toolbarMachine, ctx.root.$router)
  },
})
export default class ToolBar extends Vue {
  @Prop() toolbarMachine: any
  logoutIcon = mdiLogoutVariant
  closeIcon = mdiClose
  relevantSemesterDisciplines = [
    {
      title: 'Б8116-01.03.02',
      items: [{ title: 'Математический анализ' }],
    },
    {
      title: 'Б8115-01.03.04',
      items: [
        { title: 'Методы дистанционного зондирования Земли' },
        { title: 'Математический анализ' },
      ],
    },
  ]
}
</script>
