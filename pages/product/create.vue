<template lang="pug">
v-container
  h1.mb-6 Добавление объекта проката
  v-stepper(v-model="e6" vertical)
    v-stepper-step(:complete="e6 > 1" step="1" )
      | Основные характеристики
    v-stepper-content(step="1" )
      v-col(cols="12" sm="6")
        v-text-field(
          ref="title"
          v-model="form.title"
          label="Название"
          :rules="[() => !!form.title || 'Это поле не может быть пустым', value => value.length <= 20 || 'Max 20 characters']"
          outlined amounter
          maxlength="20"
          required)
        v-combobox(
          ref="distributor"
          :items="distributors"
          item-text="title"
          item-value="id"
          v-model="form.distributor"
          label="Пункт проката"
          :rules="[() => !!form.distributor || 'Это поле не может быть пустым']"
          outlined
          required)
        v-combobox(
          ref="category"
          :items="categories"
          v-model="form.category"
          item-text="name"
          item-value="id"
          label="Категория"
          :rules="[() => !!form.category || 'Это поле не может быть пустым']"
          outlined
          required)
        v-textarea(
          ref="description"
          v-model="form.description"
          label="Описание, характеристики"
          :rules="[() => !!form.description || 'Это поле не может быть пустым']"
          outlined
          required)

        v-btn.mt-4(color="primary" @click="next(1)") Продолжить
        v-btn.ml-2.mt-4(text to="/user" nuxt) Отмена

    v-stepper-step(:complete="e6 > 2" step="2" )
      | Ценовые характеристики
    v-stepper-content(step="2")
      v-col(cols="12" sm="6")
        v-text-field(
          ref="price"
          v-model="form.price"
          label="Цена проката в час"
          suffix="₽"
          type="number"
          :rules="[() => !!form.price || 'Это поле не может быть пустым']"
          outlined
          required)
        v-text-field(
          ref="amount"
          v-model="form.amount"
          label="Кол-во объектов для заявок"
          type="number"
          :rules="[() => !!form.amount || 'Это поле не может быть пустым']"
          outlined
          required)

        v-row
          v-col
            v-text-field(
              ref="min_hours"
              v-model="form.min_hours"
              label="Минимальное время аренды (часов)"
              :rules="[() => !!form.min_hours || 'Это поле не может быть пустым']"
              type="number"
              outlined
              required)
          v-col
            v-text-field(
              ref="min_minutes"
              v-model="form.min_minutes"
              label="Минимальное время аренды (минут)"
              :rules="[() => !!form.min_minutes || 'Это поле не может быть пустым']"
              type="number"
              outlined
              required)

        v-text-field(
          ref="pledge"
          v-model="form.pledge"
          label="Сумма залога"
          suffix="₽"
          type="number"
          outlined)

        v-btn.mt-4(color="primary" @click="next(2)") Продолжить
        v-btn.ml-2.mt-4(text @click="e6 = 1") Назад

    v-stepper-step(:complete="e6 > 3" step="3" )
      | Медиа
    v-stepper-content(step="3")
      v-col(cols="12" sm="6")
        .d-flex.align-center
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

        v-btn.mt-4(color="primary" @click="next(3)") Продолжить
        v-btn.ml-2.mt-4(text @click="e6 = 2") Назад

    v-stepper-step(step="4" ) Превью
    v-stepper-content(step="4")
      CardPreview(
        :title="form.title"
        :category="form.category && form.category.name"
        :description="form.description"
        :images="images"
        :price="form.price"
        :time="time"
      )
      v-btn.mt-4(color="success" @click="submit") Разместить 
      v-btn.ml-2.mt-4(text @click="e6 = 3") Назад
</template>

<script>
import api from '~/assets/js/api'
import { toBase64 } from '~/assets/js/helpers'
export default {
  async asyncData({ $axios }) {
    let distributors = []
    let categories = []
    try {
      distributors = await api.getDistributors($axios)
      categories = await api.getCategories($axios)
    } catch (error) {}
    return { distributors, categories }
  },
  middleware: 'myauth',
  data: () => ({
    rules: [
      (value) => !value || value.length < 15 || 'Не более 15 картинок',
      (value) =>
        (value && value.length > 0) || 'Загрузите хотя бы одну картинку',
    ],
    e6: 1,
    form: {
      title: '',
      distributor: null,
      category: null,
      description: '',
      price: '',
      amount: '',
      min_hours: '1',
      min_minutes: '0',
      pledge: '',
      photos: [],
    },
    images: [],
  }),
  computed: {
    time() {
      return this.form.min_hours + ':' + this.form.min_minutes
    },
  },
  methods: {
    async submit() {
      const formData = new FormData()
      for (const field in this.form) {
        if (['category', 'distributor'].includes(field)) {
          formData.append(field, this.form[field].id)
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
        await api.postProduct(this.$axios, formData)
        this.$store.commit('alert', {
          time: 4000,
          text: 'Продукт опубликован 😊',
        })
        this.$router.go(-1, { query: 'success' })
      } catch (error) {
        console.error(error)
      }
    },
    next(index) {
      switch (index) {
        case 1:
          this.validate(
            ['title', 'distributor', 'category', 'description'],
            index
          )
          break
        case 2:
          this.validate(['price', 'amount', 'min_hours', 'min_minutes'], index)
          break
        case 3:
          this.validate(['photos'], index)
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