<template lang="pug">
v-container
  h1.mb-6 Добавление пункта проката
  v-stepper(v-model="e6" vertical)
    v-stepper-step(:complete="e6 > 1" step="1" )
      | Основная информация
    v-stepper-content(step="1" )
      v-col(cols="12" sm="6")
        v-text-field(
          ref="title"
          v-model="form.title"
          label="Название проката"
          :rules="[() => !!form.title || 'Это поле не может быть пустым', value => value.length <= 20 || 'Max 20 characters']"
          outlined counter
          maxlength="20"
          required)
        v-textarea(
          ref="description"
          v-model="form.description"
          label="Описание, характеристики"
          :rules="[() => !!form.description || 'Это поле не может быть пустым']"
          outlined
          required)
        v-text-field(
          ref="phone"
          v-model="form.phone"
          label="Телефон"
          :rules="[() => !!form.phone || 'Это поле не может быть пустым']"
          outlined
          required)

        v-btn.mt-4(color="primary" @click="next(1)") Продолжить
        v-btn.ml-2.mt-4(text to="/user" nuxt) Отмена

    v-stepper-step(:complete="e6 > 2" step="2" )
      | Местоположение
    v-stepper-content(step="2")
      v-col(cols="12" sm="6")
        v-autocomplete(
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
        #map

        v-btn.mt-4(color="primary" @click="next(2)") Продолжить
        v-btn.ml-2.mt-4(text @click="e6 = 1") Назад

    v-stepper-step(:complete="e6 > 3" step="3" )
      | Медиа
    v-stepper-content(step="3")
      v-col(cols="12" sm="6")
        v-text-field(
          ref="url"
          v-model="form.url"
          label="Сайт"
          :rules="[() => !!form.url || 'Это поле не может быть пустым']"
          outlined
          required)
        .d-flex.align-center.mt-4
          v-icon.mr-1 mdi-information
          | Первая картинка будет главной
        v-file-input(
          ref="photos"
          :rules="rules"
          v-model="form.photos"
          accept="image/png, image/jpeg, image/bmp"
          prepend-icon="mdi-camera"
          @change="loadImages"
          small-chips multiple show-size required)

        v-btn.mt-4(color="success" @click="submit") Разместить 
        v-btn.ml-2.mt-4(text @click="e6 = 3") Назад

</template>

<script>
import api from '~/assets/js/api'
import { border } from '~/assets/js/border'
import { toBase64 } from '~/assets/js/helpers'

export default {
  head() {
    return {
      script: [
        {
          src: `https://maps.googleapis.com/maps/api/js?key=AIzaSyBIbn913V1SW-i2r0YaVtFBAwnxUs6ysW4&libraries=places&fields=name,geometry`,
          defer: true,
          callback: () => this.MapsInit(),
          hid: 'maps',
        },
      ],
    }
  },
  middleware: 'myauth',
  data: () => ({
    location: '',
    searchResults: [],
    service: null,
    sessionToken: null,
    geocoder: null,
    map: null,
    marker: null,
    rules: [
      (value) => !value || value.length < 15 || 'Не более 15 картинок',
      (value) =>
        (value && value.length > 0) || 'Загрузите хотя бы одну картинку',
    ],
    e6: 1,
    timeDialog: false,
    dateDialog: false,
    form: {
      title: '',
      description: '',
      phone: '',

      place: '',
      url: '',
      photos: [],
    },
    images: [],
  }),
  mounted() {
    this.MapsInit()
  },
  methods: {
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
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: 68.15,
          lng: 74.4,
        },
        zoom: 4,
        disableDefaultUI: true,
        mapId: 'bb10cba18348ee81',
      })
      this.marker = new google.maps.Marker({
        map: this.map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: 'Перенеси меня :3',
      })
      this.marker.addListener('dragend', this.changePlace)
      const myCoordinates = border.map(
        (coords) => new google.maps.LatLng(coords[1], coords[0])
      )
      const polyOptions = {
        path: myCoordinates,
        strokeColor: '#FF0000',
        strokeOpacity: 0.7,
        strokeWeight: 2,
      }
      const it = new google.maps.Polyline(polyOptions)
      it.setMap(this.map)
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
          const bounds = new google.maps.LatLngBounds()
          this.form.place = {
            address,
            coords: geometry.location,
          }
          this.marker.setPosition(geometry.location)
          if (geometry.viewport) {
            bounds.union(geometry.viewport)
          } else {
            bounds.extend(geometry.location)
          }
          this.map.fitBounds(bounds)
        }
      })
    },
    changePlace(event) {
      this.form.place.location = event.latLng
    },
    //
    async submit() {
      const formData = new FormData()
      for (const field in this.form) {
        if (['place'].includes(field)) {
          console.log(JSON.stringify(this.form[field]))
          formData.append('coordinate', JSON.stringify(this.form[field]))
          formData.append('address', JSON.stringify(this.form[field]))
          continue
        }
        if (['photos'].includes(field)) {
          this.form[field].forEach((element) => {
            const splitName = element.name.split('.')
            const last = splitName[splitName.length - 1]
            const name = Date.now() + '.' + last
            formData.append('photo', element, name)
          })
          continue
        }
        formData.append(field, this.form[field])
      }
      try {
        await api.postDistributor(this.$axios, formData)
        this.$router.go(-1)
        this.$store.commit('alert', {
          time: 4000,
          text: 'прокат создано 😊',
        })
      } catch (error) {}
    },
    next(index) {
      switch (index) {
        case 1:
          this.validate(['title', 'description', 'phone'], index)
          break
        case 2:
          this.validate(['place'], index)
          break
        case 3:
          this.validate(['url', 'photos'], index)
          break
        default:
          break
      }
    },
    validate(fields, index) {
      let total = true
      for (const field of fields) {
        const validation = this.$refs[field].validate(true)
        if (!validation) total = false
      }
      if (total) {
        this.e6 = index + 1
      }
    },
    async loadImages(event) {
      this.images = []
      for (const file of event) {
        const image = await toBase64(file)
        this.images.push(image)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#map {
  height: 400px;
  width: 100%;
}
</style>