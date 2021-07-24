<template lang="pug">
  .product-page
    v-container
      v-row.mt-4
        v-col(cols=5)
          client-only
            lightbox.img(css="h-200 h-lg-250" :cells="3" :items="['https://vktrpnzrv.fvds.ru' + product.photo]")

        v-col.spb.mt-4(cols=7)
          .topchick.ml-4
            h2 {{ product.title || 'Название товара' }}
            .subtitle {{ product.category.name }} 
            .mt-4.fprice(v-html="formatedPrice")
            .mt-4 Залог: 
              span.pledge &nbsp;{{ product.pledge }} ₽

          .d-flex.mt-4.button.ml-6
            RentModal(
              :id="product.id"
              :price="product.price"
            )

      h1.mt-8 Описание
      div.mt-2.desc {{ product.description || 'Описание товара' }}

    .banner
      v-container
        h1 Иформация о прокате
        .d-flex
          v-avatar.absol.ma-3(size="200")
            v-img(:src="'https://vktrpnzrv.fvds.ru' +product.distributor.photo")

          .d-flex.dist-card-b.mt-6.ml-6
            div
              h3.text-h5(v-text="product.distributor.title")
              p {{ product.distributor.description }}
              p {{ address }}
              p
                a(:href="product.distributor.url" target="_blank" ) {{ product.distributor.url }}
              p
                a(:href="'tel:' + product.distributor.phone" ) {{ product.distributor.phone }}

    v-container
      h1.mb-8(v-if="coords") На карте
      GoogleMapMarker(v-if="coords" :coords="coords")

      h1.mt-8.mb-8 Отзывы
      Comments

</template>

<script>
import api from '~/assets/js/api'
import { formatPrice } from '~/assets/js/helpers'
export default {
  async asyncData({ params, $axios }) {
    let product = {}
    try {
      product = await api.getProductById($axios, params.id)
    } catch (error) {}
    return { product }
  },
  computed: {
    formatedPrice() {
      const time = [this.product.min_hours, this.product.min_minutes].join(':')
      return formatPrice(this.product.price, time)
    },
    address() {
      let x = ''
      try {
        x = JSON.parse(this.product.distributor.coordinate)
      } catch (error) {}

      return x.address
    },
    coords() {
      let x = ''
      try {
        x = JSON.parse(this.product.distributor.coordinate)
      } catch (error) {}

      return x.coords
    },
  },
}
</script>

<style lang="scss" scoped>
.product-page ::v-deep {
  .img {
    height: 300px;
    .h-200 {
      height: 300px;
    }
  }

  .button {
    align-self: flex-start;
  }

  .pledge {
    font-size: 20px;
  }

  .fprice {
    background-color: $secondarylight;
    font-size: 28px;
    width: fit-content;
    padding: 0 5px;
    .price {
      font-size: 34px;
      font-weight: bold;
    }
  }

  .spb {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .banner {
    margin: 30px 0;
    width: 100%;
    background: $secondary;
    padding: 30px 0;
    color: white;
  }

  a {
    text-decoration: underline !important;
  }
}
</style>