<script setup lang="ts">
  import {Product} from './../interfaces/index'


  const pricing_data: Product[] = [
    {
      title: 'Ticket Plan 1',
      price: '$1',
      icon: 'shopping_cart_checkout',
      background_image: 'linear-gradient(to right, #ff5733 0%, #ec8c69 100%)',
      text: 'Cuentas con 2 opciones para ganar.'
    },
    {
      title: 'Ticket Plan 2',
      price: '$25',
      icon: 'shopping_cart_checkout',
      background_image: 'linear-gradient(-225deg, #ffd700 0%, #6BBBFF 100%)',
      text: 'Cuentas con 5 opciones para ganar.'
    },
    {
      title: 'Ticket Plan 3',
      price: '$250',
      icon: 'shopping_cart_checkout',
      background_image: 'linear-gradient(to right, #2B86C5 0%, #2B86C5 100%)',
      text: 'Cuentas con 7 opciones para ganar.'
    },
    {
      title: 'Ticket Plan 4',
      price: '$750',
      icon: 'shopping_cart_checkout',
      background_image: 'linear-gradient(87deg, rgb(17, 205, 239), rgb(17, 113, 239)) !important',
      text: 'Cuentas con 10 opciones para ganar.'
    },
  ]

</script>
<template>
  <div class="col-lg-3 col-md-3 col-xs-12 col-sm-12" v-for="{title, icon, price, text, background_image} in pricing_data" :key="title">
    <q-card class="text-white" :style="{'background-image': background_image}">
      <q-card-section>
          <div class="text-h6 text-center">
            {{ title }}
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h2 text-weight-bolder text-center">
            <q-icon :name="icon"></q-icon>
          </div>
        </q-card-section>
        <q-card-section class="q-pa-none">
          <div class="text-h2 text-weight-bolder text-center">
            {{ price }}
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-weight-bolder text-center">
            {{ text }}
          </div>
        </q-card-section>
        <q-card-actions vertical align="center">
          <q-btn outline to="/purchase" class="text-capitalize">Comprar Ahora</q-btn>
        </q-card-actions>
      </q-card>
  </div>
</template>


<style lang="scss" scoped>

</style>
