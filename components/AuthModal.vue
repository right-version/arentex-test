<template lang="pug">
  v-row.auth-modal(justify="center")
    v-dialog(value="true" persistent max-width="500px")
      v-card(v-if="!registartion ")
        v-card-title Вход
        v-card-text
          v-container
            v-row
              v-col(cols="12")
                v-text-field(
                  v-model="form.email"
                  label="Email"
                  :error-messages="formError.email"
                  outlined
                  required
                )
                v-text-field(
                  v-model="form.password"
                  label="Пароль"
                  :error-messages="formError.password"
                  outlined
                  type="password"
                  required
                )

          small Нет аккаунта?
            a
              strong.register(@click="toRegister") &nbsp;Зарегестрируйтесь
        v-divider
        v-card-actions
          v-spacer
          v-btn(text @click="$emit('close')")
            | Назад
          v-btn(color="#f06292" dark @click="login"  elevation=0)
            | Войти
      v-card(v-if="registartion")
        v-card-title Регистрация
        v-card-text
          v-container
            v-row
              v-col(cols="12")
                v-text-field(
                  v-model="form2.username"
                  label="Имя пользователя"
                  :error-messages="form2Error.username"
                  outlined
                  required
                )
                v-text-field(
                  v-model="form2.email"
                  label="Email"
                  :error-messages="form2Error.email"
                  outlined
                  required
                )
                v-text-field(
                  v-model="form2.password"
                  label="Пароль"
                  :error-messages="form2Error.password"
                  outlined
                  type="password"
                  required
                )
                v-text-field(
                  v-model="form2.password2"
                  label="Повторите пароль"
                  :error-messages="form2Error.password2"
                  outlined
                  type="password"
                  required
                )
                v-checkbox.checkbox(
                  v-model="form2.checkbox"
                  color="#f06292"
                  label="Условия политики конфеденциальности"
                  :error-messages="form2Error.checkbox")

          small Уже есть аккаунт?
            a
              strong.register(@click="toRegister") &nbsp;Вход
        v-divider
        v-card-actions
          v-spacer
          v-btn(text @click="$emit('close')")
            | Назад
          v-btn(color="#f06292" dark @click="login"  elevation=0)
            | Войти

</template>

<script>
import api from '~/assets/js/api'
import cookie from '~/assets/js/cookie'
export default {
  data: () => ({
    registartion: false,
    form: {
      email: '',
      password: '',
    },
    formError: {
      email: [],
      password: [],
    },

    form2: {
      email: '',
      password: '',
      username: '',
      password2: '',
      checkbox: false,
    },
    form2Error: {
      email: [],
      password: [],
      username: [],
      password2: [],
      checkbox: [],
    },
  }),
  computed: {
    loggedIn() {
      return this.$auth.user
    },
  },
  methods: {
    login() {
      if (!this.registartion) {
        api
          .login(this.$axios, this.form)
          .then((response) => {
            this.$store.commit('setUser', response)
            localStorage.setItem('xxx', JSON.stringify(response))
            cookie.set('xxx', JSON.stringify(response))
            this.$router.push('/user')
            this.$emit('close')
          })
          .catch((e) => {
            this.formError = e.response.data
            if (e.response.data.detail) {
              this.formError.email = e.response.data.detail
            }
          })
      } else {
        if (this.form2.password !== this.form2.password2) {
          this.form2Error.password2 = ['Пароли не совпадают']
          return
        }
        if (!this.form2.checkbox) {
          this.form2Error.checkbox = [
            'Приймите условия политики конфеденциальности',
          ]
          return
        }
        api
          .signup(this.$axios, {
            username: this.form2.username,
            email: this.form2.email,
            password: this.form2.password,
          })
          .then(() => {
            api
              .login(this.$axios, {
                email: this.form2.email,
                password: this.form2.password,
              })
              .then((response) => {
                this.$store.commit('setUser', response)
                localStorage.setItem('xxx', JSON.stringify(response))
                cookie.set('xxx', JSON.stringify(response))
                this.$router.push('/user')
                this.$emit('close')
              })
          })
          .catch((e) => {
            this.form2Error = e.response.data
            if (e.response.data.detail) {
              this.form2Error.email = e.response.data.detail
            }
          })
      }
    },
    toRegister() {
      this.registartion = !this.registartion
    },
  },
}
</script>
