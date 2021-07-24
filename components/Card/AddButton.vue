<template lang="pug">
  nuxt-link.add-button(:to="to")
    v-card(height="200" min-width="200" :class="{second: second}")
      v-hover(v-slot="{ hover }")
        v-row.fill-height(align="center" justify="center")
          v-icon(color="white" :size="!hover ? 32 : 48" ) mdi-plus-box-multiple
</template>

<script>
export default {
  props: ['to', 'second'],
}
</script>

<style lang="scss">
.add-button {
  .v-card {
    background-color: $primarydark;
  }
  .second {
    background-color: $secondarydark;
  }
  a {
    text-decoration: none !important;
    color: inherit !important;
  }
}
</style>