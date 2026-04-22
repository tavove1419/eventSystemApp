<script setup lang="ts">
 import { useQuasar } from 'quasar'
 import LoginComponent from '../components/LoginComponent.vue'
 const $q = useQuasar()

</script>

<template>
  <q-page class="flex bg-image flex-center">
    <LoginComponent></LoginComponent>
  </q-page>
</template>

<style scoped lang="scss">
  $black:  #09090c;
  $dark:   #111318;
  $card:   #16181f;
  $border: rgba(255,255,255,.08);
  $bdr2:   rgba(255,255,255,.14);
  $orange: #FF6B35;
  $red:    #E63946;
  $amber:  #FF9F1C;
  $tp:     #F2F2F5;
  $tm:     #888A99;
  .bg-image {
    background:
    radial-gradient(ellipse 70% 50% at 20% 20%, rgba(255,107,53,.1) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 80%, rgba(230,57,70,.08) 0%, transparent 60%),
    $black;
  }
</style>

