<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-full.svg"
    >
  </q-page>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'PageIndex',
  mounted () {
    login({
      username: 'admin',
      password: 'admin'
    })
      .then(res => console.log(res))
      .catch(error => console.log(error))
  }
}
</script>
