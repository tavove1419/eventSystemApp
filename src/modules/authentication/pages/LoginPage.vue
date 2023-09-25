<script setup lang="ts">
 import { useQuasar } from 'quasar'
 import LoginComponent from '../components/LoginComponent.vue'
 const $q = useQuasar()

</script>

<template>
  <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="src/assets/profile.svg">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                Inicio Sesión
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <LoginComponent></LoginComponent>
          </q-card-section>
        </q-card>
      </q-page>
</template>

<style scoped lang="scss">
  .bg-image {
    background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
  }
</style>
