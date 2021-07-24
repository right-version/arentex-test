<template lang="pug">
  v-row.rent-modal(justify="center")
    v-dialog(v-model="dialog" persistent max-width="500px")
      template(v-slot:activator="{ on, attrs }")
        v-btn(color="#00bcd4" tile elevation=0 v-bind="attrs" v-on="on") Забронировать
      v-card
        v-card-title Бронирование
        v-card-text
          v-container
            v-row
              v-col(cols="12")
                v-text-field(
                  ref="count"
                  v-model="form.count"
                  label="Кол-во объектов"
                  type="number"
                  :rules="[() => !!form.count || 'Это поле не может быть пустым']"
                  outlined
                  required)
                v-dialog(ref="dialog1" v-model="dateDialog" :return-value.sync="form.order_date" persistent width="290px")
                  template(v-slot:activator="{ on, attrs }")
                    v-text-field(
                      ref="order_date"
                      v-model="form.order_date"
                      label="Дата"
                      append-icon="mdi-calendar"
                      readonly
                      :rules="[() => !!form.order_date || 'Это поле не может быть пустым']"
                      v-bind="attrs" v-on="on"
                      outlined
                      required)
                  v-date-picker(v-model="form.order_date" scrollable locale="ru-ru")
                    v-spacer
                    v-btn(text color="primary" @click="dateDialog = false") Отмена
                    v-btn(text color="primary" @click="$refs.dialog1.save(form.order_date)") ОК

                v-dialog(ref="dialog2" v-model="timeDialog" :return-value.sync="form.order_time" persistent width="290px")
                  template(v-slot:activator="{ on, attrs }")
                    v-text-field(
                      ref="order_time"
                      v-model="form.order_time"
                      label="Время"
                      append-icon="mdi-clock-time-four-outline"
                      readonly v-bind="attrs"
                      :rules="[() => !!form.order_time || 'Это поле не может быть пустым']"
                      v-on="on"
                      outlined required)
                  v-time-picker(v-if="timeDialog" v-model="form.order_time" full-width format="24hr")
                    v-spacer
                    v-btn(text color="primary" @click="timeDialog = false") Отмена
                    v-btn(text color="primary" @click="$refs.dialog2.save(form.order_time)") ОК
                
                v-text-field(
                  ref="howmuch"
                  v-model="form.howmuch"
                  label="На какое кол-во часов"
                  type="number"
                  :rules="[() => !!form.howmuch || 'Это поле не может быть пустым']"
                  outlined
                  required)

                v-checkbox(
                  v-model="form.delivery"
                  color="#f06292"
                  label="Доставка")

                v-autocomplete(
                  v-if="form.delivery"
                  ref="place"
                  v-model="location"
                  @update:search-input="searchInput"
                  @change="setPlace"
                  :items="searchResults"
                  :rules="[() => !!location || 'Это поле не может быть пустым']"
                  label="Местоположение"
                  placeholder="Страна, город, улица, дом..."
                  append-icon="mdi-map-search"
                  outlined
                  required
                )

        v-divider
        v-card-title Итого: {{ decimal(formatedPrice) }} ₽
        v-card-text(v-if="form.delivery")
          small Стоимость доставки - 150 ₽
        v-divider

        v-card-actions
          v-spacer
          v-btn(text @click="dialog = false")
            | Омена
          v-btn(color="#f06292" dark elevation=0 @click="submit")
            | Перейти к оплате

</template>

<script>
import { decimal } from '~/assets/js/helpers'
export default {
  head() {
    return {
      script: [
        {
          src: `https://maps.googleapis.com/maps/api/js?key=AIzaSyBIbn913V1SW-i2r0YaVtFBAwnxUs6ysW4&libraries=places&fields=name,geometry`,
          defer: true,
          callback: () => this.MapsInit(),
          hid: 'maps'
        },
      ],
    }
  },
  props: ['id', 'price'],
  data() {
    return {
      location: '',
      searchResults: [],

      dialog: false,
      dateDialog: false,
      timeDialog: false,
      timeDialog2: false,
      form: {
        count: 1,
        order_date: '',
        order_time: '',

        howmuch: 1,
        delivery: false,
        where: '',
      },
    }
  },
  computed: {
    formatedPrice() {
      const deliv = this.form.delivery ? 150 : 0
      const c = !this.form.count ? 0 : this.form.count
      const hm = !this.form.howmuch ? 0 : this.form.howmuch
      return this.price * c * hm + deliv
    },
  },
  methods: {
    decimal,
    submit() {
      if (!this.validate(['count', 'order_date', 'order_time', 'howmuch'])) {
        return
      }

      this.dialog = false
      this.$store.commit('alert', {
        time: 4000,
        text: 'Оплата прошла успешно 😊',
      })
    },
    validate(fields) {
      let total = true
      for (const field of fields) {
        const validation = this.$refs[field].validate(true)
        if (!validation) total = false
      }
      if (total) {
        return true
      }
      return false
    },
    searchInput(value) {
      if (this.service && value) {
        this.service.getPlacePredictions(
          {
            input: value,
            sessionToken: this.sessionToken,
          },
          this.displaySuggestions
        )
      }
    },
    async MapsInit() {
      if (!window || !window.google) return
      console.log('Google map connected')
      this.sessionToken = new google.maps.places.AutocompleteSessionToken()
      this.service = new google.maps.places.AutocompleteService()
      this.geocoder = new window.google.maps.Geocoder()
    },
    displaySuggestions(predictions, status) {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        this.searchResults = []
        return
      }
      this.searchResults = predictions.map(
        (prediction) => prediction.description
      )
    },
    setPlace(address) {
      this.geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
          const geometry = results[0].geometry

          this.form.where = JSON.stringify({
            address,
            location: geometry.location,
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.rent-modal {
}
</style>