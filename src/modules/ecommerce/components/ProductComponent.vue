<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { getAllPlan } from '../composables/usePlanComposable';
  import { Product, PlanInterface } from './../interfaces/index'
  import { useQuasar } from 'quasar'
  // import { useEcommerceStore } from '../store/ecommerce-store';


  const $q = useQuasar()
  // const ecommerceStore = useEcommerceStore()
  const pricing_data = ref<Product[]>([])
  const planList = ref<PlanInterface[]>([])
  // const plan = ref<PlanInterface[]>([])

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
          background_image: 'radial-gradient(circle, #5f6336 0%, #ffd700 100%) !important',
          text: `Consta de ${plan.quantity_number} entrada(s) para el evento.`,
          quantity: 1
        })
      }
      $q.loading.hide()
    }).catch((error) => error);
  })

  // function onBuy(id: string): void {
  //   const data = planList.value.find((data) => data.id === id)
  //   if (data !== undefined) {
  //     data.quantity_sale = 1
  //   }
  //   plan.value.push(data as PlanInterface)
  //   ecommerceStore.buyTicket(plan.value, data?.price as number)
  // }

</script>
<template>

  <div class="col-lg-3 col-md-3 col-xs-12 col-sm-12" v-for="{ title, price, text} in pricing_data" :key="title">
    <!-- <q-card class="text-white" :style="{'background-image': background_image}"> -->
      <q-card>
        <q-card-section class="text-white text-uppercase" style="background: #3b97d1">
          <div class="text-h6 text-center">
            {{ title }}
          </div>
        </q-card-section>
        <q-card-section class="q-pa-md">
          <q-list dense padding style="border-bottom: 1px solid lightgrey;">
            <q-item><span class="text-weight-bold">{{text}}</span></q-item>
          </q-list>
        </q-card-section>
        <q-card-section class="q-pa-none" style="color: #3b97d1">
          <div class="text-center">
            <span class="text-h2 text-center">{{ price }}</span>/pesos
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-center q-px-lg">
            <div class="q-mt-md">Aplica terminos y condiciones</div>
          </div>
        </q-card-section>
      </q-card>
      <!-- <q-card-section>
          <div class="text-h6 text-center text-bold text-uppercase">
            {{ title }}
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-weight-bolder text-center">
            <q-icon :name="icon"></q-icon>
            Tiene un costo:
          </div>
        </q-card-section>
        <q-card-section class="q-pa-none">
          <div class="text-h5 text-weight-bolder text-center">
            {{ price }}
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-weight-bolder text-center">
            {{ text }}
          </div>
        </q-card-section>
        <q-card-actions vertical align="center">
          <q-btn outline to="/purchase" @click="onBuy(id)" :disable="!ecommerceStore.isActiveEvente" class="text-capitalize">Comprar Ahora</q-btn>
        </q-card-actions>
      </q-card> -->
      <q-space></q-space>
  </div>
</template>


<style lang="scss" scoped>

</style>
