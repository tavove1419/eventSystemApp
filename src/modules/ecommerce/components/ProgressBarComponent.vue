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
      <span class="text-h4">ADQUIERES TUS ENTRADAS ANTES DE QUE SE AGOTEN</span>
      <div class="q-pa-md">
        <q-linear-progress size="55px" :value="progress" color="white" class="q-mt-md">
          <div class="absolute-full flex flex-center">
            <q-badge color="warning" text-color="black" class="text-bold text-h5" :label="`${progressLabel} Vendidas`" />
          </div>
        </q-linear-progress>
      </div>
    </q-banner>
    </div>
  </div>
</template>


<style scoped>

</style>
