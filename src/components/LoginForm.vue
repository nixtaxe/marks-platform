<template>
  <v-card>
    <v-card-title>
      Добро пожаловать!
    </v-card-title>
    <v-card-text>
      <v-alert
        :value="isError"
        :outlined="true"
        type="error"
      >
        {{ context.error }}
      </v-alert>
      <v-form
        ref="form"
        @submit.prevent="onSubmit()"
      >
        <v-text-field
          v-model="username"
          name="username"
          label="Имя пользователя"
          :rules="usernameRules"
          required
          :autofocus="true"
          :disabled="isSubmitting"
          @change="sendChange({ key: 'username', value: username })"
        />
        <v-text-field
          v-model="password"
          name="password"
          label="Пароль"
          type="password"
          :rules="passwordRules"
          required
          :disabled="isSubmitting"
          @change="sendChange({ key: 'password', value: password })"
        />
        <v-card-actions>
          <v-spacer />
          <v-btn
            x-large
            min-width="150px"
            color="primary"
            type="submit"
            :loading="isSubmitting"
          >
            Войти
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import useLoginFormMachine from '@/compositions/useLoginFormMachine'

@Component({
  setup (props: any) {
    return { ...useLoginFormMachine(props.loginFormMachine) }
  },
})
export default class LoginForm extends Vue {
  @Prop() loginFormMachine: any
  username: string = ''
  password: string = ''
}
</script>
