<template lang="pug">
  v-app
    HeaderDrawer(v-model="drawer")
    Header(@clickBurger="drawer = true")

    v-snackbar(v-model="snackbar" :timeout="alert") {{ alertText }}
      template(v-slot:action="{ attrs }")
        v-btn(color="#f06292" text v-bind="attrs" @click="snackbar = false") Закрыть
  
    v-main
      nuxt

    Footer
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      snackbar: false,
    }
  },
  watch: {
    alert(value) {
      if (value && !this.snackbar) {
        this.snackbar = true
        setTimeout(() => {
          this.snackbar = false
          this.$store.commit('alert', { time: 0, text: '' })
        }, value)
      }
    },
  },
  computed: {
    alert() {
      return this.$store.state.alert
    },
    alertText() {
      return this.$store.state.alertText
    },
  },
  mounted() {
    const xxx = localStorage.getItem('xxx')
    this.$store.commit('setUser', JSON.parse(xxx))
  },
}
</script>

<style lang="scss">
// reset styles
a {
  text-decoration: none !important;
  color: inherit !important;
}

// slider styles
.lb-modal-close {
  cursor: pointer;
  width: 30px;
  height: 30px;
  right: 30px;
  &::after {
    content: ' ';
    position: absolute;
    top: 0;
    height: 30px;
    background-color: white;
    width: 2px;
    transform: rotate(45deg);
    border-radius: 2px;
  }
  &::before {
    content: ' ';
    top: 0;
    position: absolute;
    height: 30px;
    background-color: white;
    width: 2px;
    transform: rotate(-45deg);
    border-radius: 2px;
  }
}

.lb-modal-prev {
  width: 30px;
  height: 60px;
  &::after {
    content: ' ';
    position: absolute;
    top: 5px;
    height: 30px;
    background-color: white;
    width: 2px;
    transform: rotate(45deg);
    border-radius: 2px;
  }
  &::before {
    content: ' ';
    top: 25px;
    position: absolute;
    height: 30px;
    background-color: white;
    width: 2px;
    transform: rotate(-45deg);
    border-radius: 2px;
  }
}
.lb-modal-next {
  width: 30px;
  height: 60px;
  &::after {
    content: ' ';
    position: absolute;
    top: 5px;
    height: 30px;
    background-color: white;
    width: 2px;
    transform: rotate(-45deg);
    border-radius: 2px;
  }
  &::before {
    content: ' ';
    top: 25px;
    position: absolute;
    height: 30px;
    background-color: white;
    width: 2px;
    transform: rotate(45deg);
    border-radius: 2px;
  }
}
</style>
