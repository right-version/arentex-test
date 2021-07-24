<template lang="pug">
  .comments
    .comment(v-for="item in showItems" :key="item.photo")
      v-avatar(size="50" )
        v-img(:src="item.photo")
      .content
        h3 {{ item.name }}
        p.message {{ item.msg }}
</template>

<script>
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }

  return [...array]
}

const comments = [
  {
    photo: 'https://avatars.githubusercontent.com/u/70607442?v=4',
    name: 'Татьяна Ковалева',
    msg: 'Я приду!',
  },
  {
    photo:
      'https://sun9-24.userapi.com/impg/pccF7E0CPmJFMpaor-Hp4ZSlwNUaXUASLviaFA/-c5hT-UuxdE.jpg?size=2560x1920&quality=96&sign=20a345ecbac81e02562de15fbdca62f6&type=album',
    name: 'Илья Бельков',
    msg: 'Круто 👍, обязательно буду!',
  },
  {
    photo: 'http://www.nim.ru/userfiles/images/photo%2812%29.jpg',
    name: 'Мужик в форме',
    msg: '😈 Уфффф...',
  },
  {
    photo: 'https://ave86sqw5b.cdn.agency/files/2021/04/257731-1024x684.jpeg',
    name: 'Алексей',
    msg: 'Приходите все, погуляем!',
  },
  {
    photo:
      'https://i1.wp.com/www.aviasales.ru/blog/wp-content/uploads/2019/04/miscuzi.jpeg?w=1200&ssl=1',
    name: 'Итальянец',
    msg: 'Мискузи, но это просто потрясная идея!',
  },
  {
    photo: 'http://s13.ru/ru/files/news/image/1280/0/1565703845_2.jpg',
    name: 'Борат',
    msg: 'Ай харашо, нраица 👍👍',
  },
]

const items = [
  {
    photo: 'https://avatars.githubusercontent.com/u/70607442?v=4',
    name: 'Татьяна Ковалева',
    msg: 'Чудесно! 😜😜😜',
  },
  {
    photo:
      'https://sun9-24.userapi.com/impg/pccF7E0CPmJFMpaor-Hp4ZSlwNUaXUASLviaFA/-c5hT-UuxdE.jpg?size=2560x1920&quality=96&sign=20a345ecbac81e02562de15fbdca62f6&type=album',
    name: 'Илья Бельков',
    msg: 'Крутая вещь. Всем советую 👍',
  },
  {
    photo: 'http://www.nim.ru/userfiles/images/photo%2812%29.jpg',
    name: 'Мужик в форме',
    msg: '😈 Уфффф...',
  },
  {
    photo: 'https://ave86sqw5b.cdn.agency/files/2021/04/257731-1024x684.jpeg',
    name: 'Алексей',
    msg: 'Хорошо у вас тут на Ямале',
  },
  {
    photo:
      'https://i1.wp.com/www.aviasales.ru/blog/wp-content/uploads/2019/04/miscuzi.jpeg?w=1200&ssl=1',
    name: 'Итальянец',
    msg: 'Мискузи, но это просто потрясно!',
  },
  {
    photo: 'http://s13.ru/ru/files/news/image/1280/0/1565703845_2.jpg',
    name: 'Борат',
    msg: 'Ай харашо, нраица 👍👍',
  },
]

export default {
  props: ['comments'],
  data() {
    return {
      showItems: [],
    }
  },
  created() {
    if (this.comments) {
      this.showItems = shuffle(comments).slice(0, 3)
    } else {
      this.showItems = shuffle(items).slice(0, 3)
    }
  },
}
</script>

<style lang="scss">
.comments {
  .comment {
    margin-bottom: 30px;
    display: flex;
    .content {
      margin-left: 20px;

      .message {
        margin-top: 10px;
      }
    }
  }
}
</style>