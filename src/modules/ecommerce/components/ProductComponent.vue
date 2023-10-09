<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { getAllPlan } from '../composables/usePlanComposable';
  import { Product, PlanInterface } from './../interfaces/index'
  import { useQuasar } from 'quasar'
  import { useEcommerceStore } from '../store/ecommerce-store';


  const $q = useQuasar()
  const ecommerceStore = useEcommerceStore()
  const pricing_data = ref<Product[]>([])
  const planList = ref<PlanInterface[]>([])
  const plan = ref<PlanInterface[]>([])

  onMounted(() => {
    $q.loading.show({message: 'Cargando planes'})
    getAllPlan().then((response) => {
      planList.value = response.data
      for (const plan of planList.value) {
        pricing_data.value.push({
          id: plan.id,
          title: plan.name,
          price: `$ ${plan.price}`,
          icon: 'shopping_cart_checkout',
          background_image: 'radial-gradient(circle, #ff5733 0%, #ffd700 100%) !important',
          text: `Cuentas con ${plan.quantity_number} opcione(s) para ganar.`,
          quantity: 1
        })
      }
      $q.loading.hide()
    }).catch((error) => error);
  })

  function onBuy(id: string): void {
    const data = planList.value.find((data) => data.id === id)
    if (data !== undefined) {
      data.quantity_sale = 1
    }
    plan.value.push(data as PlanInterface)
    ecommerceStore.buyTicket(plan.value, data?.price as number)
  }

</script>
<template>

  <div class="col-lg-3 col-md-3 col-xs-12 col-sm-12" v-for="{id, title, icon, price, text, background_image} in pricing_data" :key="title">
    <q-card class="text-white" :style="{'background-image': background_image}">
      <q-card-section>
          <div class="text-h6 text-center text-uppercase">
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
          <q-btn outline to="/purchase" @click="onBuy(id)"  class="text-capitalize">Comprar Ahora</q-btn>
        </q-card-actions>
      </q-card>
      <q-space></q-space>
  </div>
</template>


<style lang="scss" scoped>

</style>
