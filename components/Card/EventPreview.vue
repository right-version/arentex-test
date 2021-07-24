<template lang="pug">
div
  v-row.preview-card
    v-col(cols=12 sm=6)
      v-card(elevation="0" tile style="margin-top: 1px")
        v-img(height="250" :src="images && images[0]")
        h2.mt-2.mb-2 {{ title || 'Название' }}
        v-divider.mb-2
        .mt-2.subtitle-1(v-if="date") {{new Date(date).toLocaleDateString('ru-RU', { month: 'long', day: 'numeric'})}}
        .mt-2.subtitle-1(v-if="time") {{ time }}
        .mt-2.subtitle-1(v-if="address") {{ address }}
    v-col(cols=12 sm=6)
      client-only
        lightbox.card(css="h-200 h-lg-250" :cells="4" :items="images")

  .description(v-if="description" v-html="description")

</template>

<script>
export default {
  props: ['images', 'title', 'description', 'time', 'date', 'address'],
}
</script>

<style lang="scss" scoped>
.card ::v-deep {
  .h-200 {
    min-height: 500px;
    @include mw(600px) {
      min-height: 250px;
    }
  }
}
</style>
