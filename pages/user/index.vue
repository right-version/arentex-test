<template lang="pug">
  v-container
    .mt-12.d-flex.align-center
      v-icon.mr-6(color="black" size="38") mdi-shield-key
      h1  Добавить пункт проката
    v-row
      v-col.mt-11(cols="2")
        CardAddButton(to="/distributor/create")
    .mt-12.d-flex.align-center
      v-icon.mr-6(color="black" size="38") mdi-snowboard
      h1  Добавить объект проката
    v-row
      v-col.mt-11(cols="2")
        CardAddButton(to="/product/create" second="true")
    .mt-12.d-flex.align-center
      v-icon.mr-6(color="black" size="38") mdi-calendar-check
      h1  Добавить событие
    v-row
      v-col.mt-11(cols="2")
        CardAddButton(to="/event/create")

</template>
<script>
export default {
  middleware: 'myauth',
}
</script>

<style lang="scss" scoped>
</style>