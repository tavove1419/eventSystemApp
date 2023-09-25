<script setup lang="ts">
  import { ref } from 'vue'

  const loginForm = ref( {
    username: <string | null>null,
    password: <string | null>null,
  })
</script>

<template>
  <q-form class="q-gutter-md">
    <q-input filled v-model="loginForm.username" label="Usuario" lazy-rules />

    <q-input type="password" filled v-model="loginForm.password" label="Contraseña" lazy-rules />

    <div class="q-gutter-sm row items-center no-wrap justify-center">
      <q-btn label="Login" to="/" type="button" color="primary" />
      <q-btn label="Cancelar" to="/" type="button" color="negative" />
    </div>
  </q-form>
</template>

<style scoped lang="scss">

</style>
