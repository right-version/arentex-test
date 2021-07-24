<template lang="pug">
v-row.preview-card
  v-col(cols=12 sm=6)
    v-card(elevation="0" tile style="margin-top: 1px")
      v-img(height="250" :src="images && images[0]")
      h2.mt-2.mb-2 {{ title || 'Название' }}
      v-divider.mb-2
      .mt-2.subtitle-1(v-html="formatedPrice")
      .mt-2.subtitle-1 {{ category || 'Категория' }}
      .mt-2.subtitle-1.description {{ formatedDescription || 'Описание' }}
  v-col(cols=12 sm=6)
    client-only
      lightbox.card(css="h-200 h-lg-250" :cells="4" :items="images")


</template>

<script>
import { formatPrice } from '~/assets/js/helpers'
export default {
  props: ['images', 'title', 'category', 'description', 'time', 'price'],
  computed: {
    formatedDescription() {
      if (this.description.length > 250) {
        return this.description.substr(0, 250) + '...'
      }
      return this.description
    },
    formatedPrice() {
      if (this.price) {
        return formatPrice(this.price, this.time)
      }
      return ''
    },
  },
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