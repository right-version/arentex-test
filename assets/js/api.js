export default {
  signup(axios, data) {
    return axios.$post('/auth/register/', data)
  },
  login(axios, data) {
    return axios.$post('/auth/login/', data)
  },

  getProduct(axios) {
    return axios.$get('/product/')
  },
  getProductById(axios, id) {
    return axios.$get(`/product/${id}`)
  },
  postProduct(axios, data) {
    return axios.$post('/product/', data)
  },

  getCategories(axios) {
    return axios.$get('/category/')
  },
  getDistributors(axios) {
    return axios.$get('/distributor/')
  },
  postDistributor(axios, data) {
    return axios.$post('/distributor/', data)
  },

  getEvent(axios) {
    return axios.$get('/event/')
  },
  postEvent(axios, data) {
    return axios.$post('/event/', data)
  },
  getEventById(axios, id) {
    return axios.$get(`/event/${id}`)
  }
}
