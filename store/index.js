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
  async nuxtServerInit({ commit }, { req, $axios }) {
    const headers = req && req.headers
    let user = null

    try {
      user = JSON.parse(cookie.get('xxx', headers.cookie))
    } catch (error) {}
    commit('setUser', user)
  }
}

// this.$store.commit('alert', { time: 2000, text: '+ 1' })
