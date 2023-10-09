<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { getAllPlan } from '../composables/usePlanComposable';
  import { PlanInterface } from './../interfaces/index'
  import { useQuasar, QTableProps } from 'quasar'
  import { useEcommerceStore } from '../store/ecommerce-store';
  import { useRouter } from 'vue-router'

  const $q = useQuasar()
  const router = useRouter()
  const ecommerceStore = useEcommerceStore()
  const planList = ref<PlanInterface[]>([])
  const plans = ref<PlanInterface[]>([])
  const subtotal = ref<number>(0)
  const columns: QTableProps['columns'] = [
    {
      name: 'name',
      required: true,
      label: 'Producto / Plan',
      align: 'left',
      sortable: true,
      field: 'name'
    },
    {
      name: 'quantity_number',
      required: true,
      label: 'Numeros por Plan',
      align: 'left',
      field: 'quantity_number',
    },
    {
      name: 'price',
      required: true,
      label: 'Precio',
      align: 'left',
      sortable: true,
      field: 'price'
    },
    {
      name: 'quantity_sale',
      required: true,
      label: 'Cantidad',
      align: 'left',
      field: 'quantity_sale',
    }
  ]

  onMounted(() => {
    $q.loading.show({message: 'Cargando planes'})
    getAllPlan().then((response) => {
      for (const data of response.data){
        planList.value.push({
          id: data.id,
          name: data.name,
          price: data.price,
          quantity_number: data.quantity_number,
          active: data.active,
          quantity_sale: 0
        })
      }
      $q.loading.hide()
    }).catch((error) => error);
  })


  function onBlur(newValue: number): void {
    if (newValue >= 0) {
      subtotal.value = 0
      for (const data of planList.value) {
        const quantities = data.quantity_sale ? data.quantity_sale : 0
        subtotal.value = subtotal.value + (data.price * quantities)
      }
    }
  }

  function onBuy(): void {
    if (subtotal.value === 0)
      return notify('Es necesario indicar la cantidad de al menos un plan para finalizar la compra', 'warning')
    for (const data of planList.value) {
      if (data.quantity_sale !== 0) {
        plans.value.push(data)
      }
    }
    ecommerceStore.buyTicket(plans.value, subtotal.value)
    router.push('/purchase')
  }

  function notify(msg: string, type: string) {
    $q.notify({
      message: msg,
      type: type,
      position: 'top',
      timeout: 5000
    })
  }


</script>
<template>
  <div class="q-pa-sm q-gutter-sm">
    <q-table
      flat
      bordered
      :rows="planList"
      :columns="columns"
      row-key="name"
      hide-bottom
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="quantity_number" :props="props">
            {{ props.row.quantity_number }}
          </q-td>
          <q-td key="price" :props="props">
            <q-badge color="green">
              $ {{ props.row.price }}
            </q-badge>
          </q-td>
          <q-td key="quantity_sale" :props="props">
            <q-input
              outlined
              style="max-width: 100px"
              :type="'number'"
              v-model="props.row.quantity_sale"
              dense autofocus
              @update:model-value="newValue => onBlur(props.row.quantity_sale)"
              :rules="[val => val >= 0 || 'Ingresar cantidad correcta']"
            >
            </q-input>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-space />
    <q-card class="my-card" flat bordered>
      <q-card-actions align="center">
        <q-item >
          <q-item-section avatar>
            <q-icon color="red" name="currency_exchange" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Total a pagar: $ {{ subtotal }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-actions>
      <q-card-actions align="center">
        <q-btn color="red" @click="onBuy()" icon="shopping_cart_checkout" icon-right="send" label="Finalizar Compra" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<style scoped>
</style>
