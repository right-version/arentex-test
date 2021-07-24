<template lang="pug">
  v-card.dist-card(outlined elevation=0)
    v-avatar.absol.ma-3(size="200")
      v-img(:src="photo")
    .d-flex.dist-card-b
      div
        v-card-title.text-h5(v-text="title")
        v-card-subtitle.mt-2(v-text="adress")
        v-card-subtitle
          a(:href="url" target="_blank" ) {{ url }}
        v-card-subtitle
          a(:href="'tel:' + phone" ) {{ phone }}

    v-card-actions.pb-4
      v-btn.ml-2.mt-5(color="#ad1457" dark @click="$emit('click', id)")
        | Посмотреть объекты аренды


</template>

<script>
export default {
  props: ['id', 'title', 'photo', 'adress', 'url', 'phone'],
}
</script>

<style lang="scss" scoped>
.dist-card {
  position: relative;
  min-height: 415px;
  margin-left: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  a {
    text-decoration: underline !important;
  }

  .absol {
    position: absolute;
    bottom: 60px;
    right: 20px;
    border-radius: 100% !important;
  }
}
</style>