<template>
  <v-card>
    <v-card-title>
      Добро пожаловать!
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="username"
          label="Имя пользователя"
        />
        <v-text-field
          v-model="password"
          label="Пароль"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        x-large
        min-width="150px"
        color="primary"
      >
        Войти
      </v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class LoginForm extends Vue {
  username: String = ''
  password: String = ''
}
</script>
