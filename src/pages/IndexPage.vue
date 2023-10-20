<template>
  <div>
    <q-card class="q-pa-md">
      <q-card-section class="text-h6">
        Numeros vendidos {{ value * 1000 }} de 1.000
      </q-card-section>
      <q-card-section align="center">
        <q-circular-progress
          show-value
          font-size="12px"
          :value="value"
          size="200px"
          :thickness="0.3"
          color="primary"
          track-color="grey-3"
          class="q-ma-md"
        >
          {{ (value * 100).toFixed(1) }}%
        </q-circular-progress>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">

import { assignedCounter } from 'src/modules/ecommerce/composables/useProgressBarComposable';
import { ref, onMounted } from 'vue';

const value = ref<number>(0)

onMounted(() => {
  assignedCounter().then((response) => {
      value.value = response.data / 1000
    })
  })

</script>
