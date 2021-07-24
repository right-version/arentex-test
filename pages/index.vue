<template lang="pug">
  v-container
    v-tabs(v-model="tabs")
      v-tab Списком
      v-tab На карте

      v-tab-item.mt-5.mb-5.ml-1
        v-row
          v-col(cols=3)
            v-card.py-6.px-3(elevation=3 outlined)
              v-select(
                v-model="selectedDist"
                :items="formatDist"
                label="Выберите прокат"
                outlined
                item-text="title"
                item-value="id"
              )
              v-select(
                v-model="selectedCategory"
                :items="formatCategories"
                label="Выберите категорию"
                outlined
                item-text="name"
                item-value="id"
              )

              v-checkbox(
                v-model="hasToday"
                label="Доступные сегодня")
              v-checkbox(
                v-model="withoutPledge"
                label="Без залога")



          v-col(cols=9)
            .d-flex.align-center.justify-space-between
              v-text-field(
                v-model="search"
                solo
                flat
                placeholder="Поиск по объявлениям"
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
            v-divider
            v-row.mt-4.align-center
              v-col(v-for="(product, index) in formatProducts" :key="'product-' + index" cols=4)
                CardProduct(
                  :id="product.id"
                  :photo="product.photo"
                  :title="product.title"
                  :distributor="product.distributor"
                  :rating="4"
                  :price="product.price"
                  :min_hours="product.min_hours"
                  :min_minutes="product.min_minutes"
                  :amount="product.amount"
                  :pledge="product.pledge"
                )
              p.ml-3(v-if="formatProducts.length === 0") Ничего не найдено 😢

      v-tab-item.mt-5
        GoogleMap(:dist="dist" @click="tabs = 0; selectedDist = $event")

</template>

<script>
import api from '~/assets/js/api'
export default {
  async asyncData({ $axios }) {
    let products = []
    let dist = []
    let categories = []
    try {
      products = await api.getProduct($axios)
      dist = await api.getDistributors($axios)
      categories = await api.getCategories($axios)
    } catch (e) {
      console.error(e)
    }
    return { products, dist, categories }
  },
  data() {
    return {
      selectedDist: null,
      selectedCategory: null,

      hasToday: false,
      withoutPledge: false,

      tabs: 0,
      selectedItem: 'Без сортировки',
      items: ['Без сортировки', 'По цене'],
      panels: [1, 2],
      search: '',
      copy: [],
    }
  },
  computed: {
    formatDist() {
      const defaultDist = { title: 'Любой', id: null }
      return [...this.dist, defaultDist]
    },
    formatCategories() {
      const defaultCategory = { name: 'Любая', id: null }
      return [...this.categories, defaultCategory]
    },
    formatProducts() {
      this.copy = JSON.parse(JSON.stringify(this.products))

      // Поиск
      if (this.search.trim()) {
        this.copy = this.copy.filter((el) => {
          return (el.title + ' ' + el.distributor)
            .toLowerCase()
            .includes(this.search.toLowerCase().trim())
        })
      }

      // Фильтры
      if (this.selectedCategory !== null) {
        this.copy = this.copy.filter(
          (el) => el.category.id === this.selectedCategory
        )
      }
      if (this.selectedDist !== null) {
        this.copy = this.copy.filter((el) => {
          const di = this.dist.find((el) => el.id === this.selectedDist)
          return el.distributor === di.title
        })
      }

      // Чекбоксы
      if (this.hasToday) {
        this.copy = this.copy.filter((el) => el.amount !== 0)
      }
      if (this.withoutPledge) {
        this.copy = this.copy.filter((el) => !el.pledge)
      }

      // Сортировка
      if (this.selectedItem === 'Без сортировки') {
      } else {
        this.copy = this.copy.sort((a, b) => {
          return b.price - a.price
        })
      }

      return this.copy
    },
  },
}
</script>

<style lang="scss" scoped>
</style>