export default {
  getProducts(axios, data) {
    return axios.$post('/inventory/items/', data)
  }
}
