import cookie from '~/assets/js/cookie'
export const state = () => ({
  alert: -1,
  alertText: '',

  user: null
})

export const mutations = {
  alert(state, { time, text }) {
    state.alert = time
    state.alertText = text
  },

  setUser(state, user) {
    state.user = user
  }
}

export const actions = {
  async nuxtServerInit(_, { $axios }) {
    const res = await $axios.post(`${process.env.NUXT_ENV_BASE_URL}/login`, {
      login: process.env.NUXT_ENV_LOGIN,
      password: process.env.NUXT_ENV_PASSWORD
    })

    $axios.setToken(res.data.access_token, 'Bearer')
  }
}
