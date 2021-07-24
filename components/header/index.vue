<template lang="pug">
  v-app-bar(flat app)
    AuthModal.absoltely(v-if="modal"  @close="modal=false")
    v-app-bar-nav-icon.hidden-md-and-up(@click="$emit('clickBurger')")
    v-container.py-0.hidden-sm-and-down
      v-row.align-center.justify-space-between
        nuxt-link(to="/" nuxt)
          h2.logo ЯНАО Шеринг

        .d-flex.align-center
          v-btn(
            color="white"
            elevation=0
            v-for="(link, index) in mainLinks"
            :key="'nav-link-' + index"
            :to="link.to"
            nuxt
            text
          ) {{ link.title }}

          v-btn.ml-2(icon @click="onClick")
            v-icon(color="white" size="34") mdi-account-circle


</template>

<script>
import { mainLinks } from './links'
export default {
  name: 'AppHeader',
  data: () => ({ mainLinks, modal: false }),
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  methods: {
    onClick() {
      if (this.user) {
        this.$router.push('/user')
      } else {
        this.modal = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
header {
  position: relative;
  height: 64px !important;
  background: transparent !important;
  transition: all 0.4s linear;
  backdrop-filter: saturate(180%) blur(20px) !important;

  .absoltely {
    position: fixed;
    top: 0;
    left: 0;
  }

  .v-toolbar__content {
    height: 64px !important;
  }

  &::after {
    content: ' ';
    position: absolute;
    background-color: $primarydark !important;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -10;
    opacity: 0.5;
  }

  .logo {
    color: white;
  }
}
</style>