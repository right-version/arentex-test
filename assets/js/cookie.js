export default {
  set(key, value) {
    document.cookie = `${key}=${value}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`
  },
  get(key, cookies) {
    if (!cookies) return
    const match = cookies.match(new RegExp('(^| )' + key + '=([^;]+)'))
    if (match) return match[2]
  },
  delete(key) {
    document.cookie = `${key}=; expires=${new Date(0).toUTCString()}`
  }
}
