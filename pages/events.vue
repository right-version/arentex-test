<template lang="pug">
v-container.page
  v-tabs
    v-tab Список

    v-tab-item.mt-5.mb-5.ml-1
      .d-flex.align-center.justify-space-between
        v-text-field(
          v-model.trim="search"
          solo
          flat
          placeholder="Поиск по событиям"
          single-line
          prepend-icon="mdi-magnify"
          hide-details
        )
        v-select(
          v-model="selectedItem"
          :items="items"
          hide-details
          prepend-icon="mdi-sort"
          style="max-width: 250px;"
          single-line
          solo
          flat)
      v-divider.mb-4
      v-card.event-card.mb-4.mr-1(
        elevation="0"
        v-for="(event, index) in formatedEvents"
        :key="'event' + index"
        outlined
      )
        .d-flex
          v-avatar(tile size="200" color="#fce4ec")
            v-img(:src="event.images[0] && 'https://vktrpnzrv.fvds.ru' + event.images[0].image")
          
          .ml-4.card-sp
            .card__top
              h1.mb-1 {{ event.title }}
              p {{ new Date(event.event_date).toLocaleDateString('ru-RU', { month: 'long', day: 'numeric'}) }}, {{ event.event_time.slice(0, -3) }}
            .card__bot.pb-4.pr-4.d-flex.justify-end
              v-btn.butt(color="#f06292" :to="`/event/${event.id}`" tile elevation="0" dark nuxt) Подробнее

</template>

<script>
import api from '~/assets/js/api'
export default {
  async asyncData({ $axios }) {
    let events
    try {
      events = await api.getEvent($axios)
    } catch (error) {}
    return { events }
  },
  data() {
    return {
      search: '',
      copy: [],
      selectedItem: 'По дате',
      items: ['По дате', 'По кол-ву участников'],
    }
  },
  computed: {
    formatedEvents() {
      this.copy = JSON.parse(JSON.stringify(this.events))

      // Поиск
      if (this.search) {
        this.copy = this.copy.filter((el) => {
          return el.title.toLowerCase().includes(this.search.toLowerCase())
        })
      }

      // Сортировка
      if (this.selectedItem === 'По кол-ву участников') {
      } else {
        this.copy = this.copy.sort((a, b) => {
          return new Date(b.event_date) - new Date(a.event_date)
        })
      }

      return this.copy
    },
  },
}
</script>

<style lang="scss">
.event-card {
  max-width: 800px !important;

  .card-sp {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .card__bot {
      display: flex;
      align-items: flex-end;

      .butt {
        color: white !important;
      }
    }
  }
}
</style>