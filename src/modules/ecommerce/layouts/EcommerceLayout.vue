
<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  // import { useEcommerceStore } from '../store/ecommerce-store';

  const year = ref<number>(0)
  // const ecommerceStore = useEcommerceStore()

  onMounted(() => {
    year.value = (new Date()).getFullYear()
  })

</script>

<template>
  <div id="fondo"></div>
  <q-layout  view="hHh lpR fFf" style="background:linear-gradient( 135deg, #74cfdb 10%, #02f892 100%)">

    <q-header class="bg-transparent text-white">
      <q-toolbar class="q-pa-md">
        <q-toolbar-title >
          <!-- <img style="height: 10%; width: 10%;" src="../../../assets/EVENTS.png" /> -->
        </q-toolbar-title>
        <q-space/>

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn square dense flat color="text-grey-7" to="/" label="inicio" icon="dashboard">
            <q-tooltip>Home</q-tooltip>
          </q-btn>
          <!-- <q-btn square dense flat color="text-grey-7" to="/sales" :disable="!ecommerceStore.isActiveEvente" label="Comprar" icon="shopping_cart">
            <q-tooltip>Comprar</q-tooltip>
          </q-btn> -->
          <q-btn square dense flat color="text-grey-7" to="/login" label="Login" icon="verified_user">
            <q-tooltip>Login</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <section class="flex row flex-center q-py-sm ">
      <div class="text-subtitle1 text-white ">
        Copyright © {{ year }}, made by
        <q-icon name="fas fa-desktop"></q-icon>
        NimetSoft
      </div>
    </section>

  </q-layout>
</template>

<style scoped lang="scss">
  .tittle-logo {
    height: 50px;
    width: 50px;
  }
</style>
