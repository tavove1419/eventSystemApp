<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { assignedCounter } from '../composables/useProgressBarComposable';


  const progress = ref(0)
  const progressLabel = ref('')

  onMounted(() => {
    assignedCounter().then((response) => {
      progress.value = response.data / 1000
      progressLabel.value = (progress.value * 100).toFixed(1) + '%'
    })
  })
</script>

<template>
  <div id="q-app">
    <div class="q-pa-md q-gutter-sm">
    <q-banner inline-actions rounded class="bg-positive text-white text-center">
        SIGUE EL PROGRESO DE TICKETS, NO ESPERES A ÚLTIMO MOMENTO Y ADQUIERE LOS TUYO PRONTO ANTES DE QUE SE AGOTEN!!!!
      <div class="q-pa-md">
        <q-linear-progress size="40px" :value="progress" color="white" class="q-mt-sm">
          <div class="absolute-full flex flex-center">
            <q-badge color="warning" text-color="black" :label="progressLabel" />
          </div>
        </q-linear-progress>
      </div>
    </q-banner>
    </div>
  </div>
</template>


<style scoped>

</style>
