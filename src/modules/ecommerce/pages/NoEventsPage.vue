<script setup lang="ts">
  import { ref } from 'vue'

  const stars = ref<number>(5)
  const card = ref<boolean>(true)
</script>
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="card">
      <q-card class="my-card">
        <q-img src="https://picsum.photos/500/300" />

        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="place"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%);"
          />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis q-mt-md">
              Muy pronto un nuevo evento estará disponible
            </div>
          </div>

          <q-rating v-model="stars" :max="5" size="32px" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            Recuerda estar atento, pronto podrás aquirir los planes
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" disable round icon="event" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>


<style scoped>

</style>
