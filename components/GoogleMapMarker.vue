<template lang="pug">
  .map-wrapper
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
  props: ['coords'],
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
        center: this.coords,
        zoom: 12,
        disableDefaultUI: true,
        mapId: 'bb10cba18348ee81',
      })
      this.marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
      })
      this.marker.setPosition(this.coords)
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
    },
  },
}
</script>

<style lang="scss" scoped>
#gmap {
  height: 400px;
  width: 100%;
}
</style>