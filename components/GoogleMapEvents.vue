<template lang="pug">
  .map-wrapper
    v-row
      v-col(cols="5")
        v-autocomplete(
          v-model="location"
          @update:search-input="searchInput"
          @change="setPlace"
          :items="searchResults"
          label="Поиск на карте"
          placeholder="Страна, город, улица, дом..."
          append-icon="mdi-map-search"
          outlined
          required)

        CardDist(
          v-if="card"
          :id="card.el.id"
          :title="card.el.title"
          :photo="card.el.photo"
          :adress="card.address"
          :url="card.el.url"
          @click="$emit('click', id)"
        )

      v-col(cols="7")
        #gmap
</template>

<script>
import { border } from '~/assets/js/border'
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
  props: ['dist'],
  data() {
    return {
      sessionToken: null,
      service: null,
      geocoder: null,
      map: null,
      marker: null,
      location: '',
      searchResults: [],

      card: null,
    }
  },
  mounted() {
    this.MapsInit()
  },
  methods: {
    async MapsInit() {
      if (!window || !window.google) return
      console.log('Google map connected')
      this.sessionToken = new google.maps.places.AutocompleteSessionToken()
      this.service = new google.maps.places.AutocompleteService()
      this.geocoder = new window.google.maps.Geocoder()
      this.map = new google.maps.Map(document.getElementById('gmap'), {
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
        animation: google.maps.Animation.DROP,
      })
      const myCoordinates = border.map(
        (coords) => new google.maps.LatLng(coords[1], coords[0])
      )
      const polyOptions = {
        path: myCoordinates,
        strokeColor: '#ad1457',
        strokeOpacity: 0.7,
        strokeWeight: 2,
      }
      const it = new google.maps.Polyline(polyOptions)
      it.setMap(this.map)

      const setEvent = (marker, address, el) => {
        marker.addListener('click', () => {
          this.card = { address, el }
        })
      }

      this.dist.forEach((el) => {
        const { address, coords } = JSON.parse(el.coordinate)
        const marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: coords,
        })

        setEvent(marker, address, el)
      })
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

          console.log(this.getStringData(results))

          // this.marker.setPosition(geometry.location)
          if (geometry.viewport) {
            bounds.union(geometry.viewport)
          } else {
            bounds.extend(geometry.location)
          }
          this.map.fitBounds(bounds)
        }
      })
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
    getStringData(results) {
      const data = {
        address: results[0].formatted_address,
        coords: results[0].geometry.location,
      }
      return JSON.stringify(data)
    },
  },
}
</script>

<style lang="scss" scoped>
#gmap {
  height: 500px;
  width: 100%;
}
</style>