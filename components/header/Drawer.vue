
<template lang="pug">
    v-navigation-drawer(:value="value" @input="$emit('input')" app fixed temporary dark)
      v-list(nav dense)
        v-list-item-group
          v-list-item(
            v-for="(link, index) in mainLinks"
            :key="'nav-link-' + index"
            :to="link.to"
            nuxt
          ) {{ link.title }}

</template>

<script>
import { mainLinks } from './links'
export default {
  name: 'AppHeader',
  props: ['value'],
  data: () => ({ mainLinks }),
}
</script>