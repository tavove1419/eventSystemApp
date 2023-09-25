<script setup lang="ts">
  import PurchaseComponent from './../../ecommerce/components/PurchaseComponent.vue';
</script>

<template>
  <q-page-container>
    <section style="min-height: 25vh;" class="flex text-white flex-center layout_bg">
      <div style="position: relative">
        <div class="text-h4 text-center">
          Finaliza tu compra
        </div>
        <div class="text-subtitle2 q-pt-sm text-center">
          Ingresa la información solicitada para finalizar la compra de este evento
        </div>
      </div>
    </section>

    <PurchaseComponent></PurchaseComponent>
  </q-page-container>
</template>

<style scoped>

</style>
