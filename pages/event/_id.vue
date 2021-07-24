<template lang="pug">
  .event-page
    v-container
      v-row.mt-4
        v-col(cols=5)
          client-only
            lightbox.img(css="h-200 h-lg-250" :cells="3" :items="event.images.map(el => 'https://vktrpnzrv.fvds.ru' + el.image)")

        v-col.spb.mt-4(cols=7)
          .topchick.ml-4
            h2 {{ event.title || 'Название товара' }}
            .mt-2.subtitle-1(v-if="event.event_date") {{new Date(event.event_date).toLocaleDateString('ru-RU', { month: 'long', day: 'numeric'})}}
            .mt-2.subtitle-1(v-if="event.event_time") {{ event.event_time.slice(0,-3) }}
            .mt-2.subtitle-1(v-if="address") {{ address }}

          v-btn(color="#00bcd4" tile elevation=0 @click="onClick").ml-4 Я участвую!

      h1.mt-8 Подробнее
      div.mt-2.mb-8(v-html="event.description")
      
      h1.mt-8.mb-8(v-if="coords") На карте
      GoogleMapMarker(v-if="coords").pb-4(:coords="coords")

      h1.mb-8.mb-8 Комментарии
      Comments(comments)

</template>

<script>
import api from '~/assets/js/api'

export default {
  async asyncData({ params, $axios }) {
    let event = {}
    try {
      event = await api.getEventById($axios, params.id)
    } catch (error) {}
    return { event }
  },
  computed: {
    address() {
      let x = ''
      try {
        x = JSON.parse(this.event.coordinates)
      } catch (error) {}

      return x.address
    },
    coords() {
      let x = ''
      try {
        x = JSON.parse(this.event.coordinates)
      } catch (error) {}
      return x.coords
    },
  },
  methods: {
    onClick() {
      this.$store.commit('alert', { time: 2000, text: '+ 1' })
    },
  },
}
</script>

<style lang="scss" scoped>
.event-page ::v-deep {
  .img {
    height: 300px;
    .h-200 {
      height: 300px;
    }
  }

  .spb {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .v-btn {
      width: fit-content !important;
    }
  }
}
</style>