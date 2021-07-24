<template lang="pug">
.product-card
  
  v-hover(v-slot="{ hover }")
    v-card(flat tile :class="{'hover-card': hover, 'no-amount': !amount}" outlined)
      .image-wrap
        v-img.image(v-if="photo" :src="'https://vktrpnzrv.fvds.ru' + photo" height="200px" :class="{hover}")

      v-card-title.title {{ title }}
      v-card-subtitle {{ distributor}}
      .fprice.ml-4(v-html="formatedPrice")
      .pledge.ml-4(v-if="pledge") с залогом
      .pledge.ml-4(v-else)

      .control.mr-2.pb-2.mt-4
        v-btn(:to="`/product/${id}`" nuxt tile text) Подробнее

      v-fade-transition
        v-overlay(v-if="hover && !amount" absolute color="#006064")
          v-chip(color="#ad1457" label) Забронировано на сегодня


</template>

<script>
import { formatPrice } from '~/assets/js/helpers'
export default {
  props: [
    'id',
    'photo',
    'title',
    'distributor',
    'rating',
    'price',
    'min_hours',
    'min_minutes',
    'pledge',
    'amount',
  ],
  computed: {
    formatedPrice() {
      const time = [this.min_hours, this.min_minutes].join(':')
      return formatPrice(this.price, time)
    },
  },
}
</script>

<style lang="scss" scoped>
.product-card ::v-deep {
  margin: 2px;

  .v-card {
    min-height: 405px;
  }

  .hover-card {
    background-color: #fce4ec23;
  }

  .no-amount {
    opacity: 0.4;
  }

  .image-wrap {
    overflow: hidden;
    height: 200px;

    .image {
      transition: all 0.3s;
      min-width: calc(100% + 15px);
      transform: translateX(-15px);
      &.hover {
        transform: translateX(0);
      }
    }
  }

  .title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 90%;
    display: block;
  }

  .fprice {
    background-color: $secondarylight;
    font-size: 20px;
    width: fit-content;
    padding: 0 5px;
    .price {
      font-size: 28px;
    }
  }

  .pledge {
    margin-top: 2px;
    color: $secondarydark;
    font-size: 10px;
    text-transform: uppercase;
  }

  .control {
    display: flex;
    justify-content: flex-end;
  }

  a {
    text-decoration: none !important;
    color: inherit !important;
  }
}
</style>