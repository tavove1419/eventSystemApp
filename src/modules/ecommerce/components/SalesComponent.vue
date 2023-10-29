<script setup lang="ts">
  import { onMounted, ref, reactive } from 'vue';
  import { getAllPlan } from '../composables/usePlanComposable';
  import { PlanInterface } from './../interfaces/index'
  import { useQuasar, QTableProps } from 'quasar'
  import { useEcommerceStore } from '../store/ecommerce-store';
  import { useRouter } from 'vue-router'
  import VueClientRecaptcha from 'vue-client-recaptcha'

  const $q = useQuasar()
  const router = useRouter()
  const ecommerceStore = useEcommerceStore()
  const planList = ref<PlanInterface[]>([])
  const plans = ref<PlanInterface[]>([])
  const subtotal = ref<number>(0)
  const inputValue = ref(null);
  const data = reactive({
    captchaCode: <string | null>null,
    isValid: false
  })
  const columns: QTableProps['columns'] = [
    {
      name: 'name',
      required: true,
      label: 'Plan',
      align: 'left',
      sortable: true,
      field: 'name'
    },
    {
      name: 'quantity_number',
      required: true,
      label: 'Entradas',
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

  const columnsM: QTableProps['columns'] = [
    {
      name: 'name',
      required: true,
      label: 'Plan',
      align: 'left',
      sortable: true,
      field: 'name'
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

  const getCaptchaCode = (value: string) => {
    data.captchaCode = value;
  };

  const checkValidCaptcha = (value: boolean) => {
    data.isValid = value;
    if (value) {
      notify('Código Correcto', 'positive')
    }
  };

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
    if (!data.isValid)
      return notify('Código Validación Incorrecto', 'negative')
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
      class="v1"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props" class="w-c">
            {{ props.row.name }}
          </q-td>
          <q-td key="quantity_number" :props="props" class="w-c ">
            {{ props.row.quantity_number }}
          </q-td>
          <q-td key="price" :props="props" class="w-c">
            <q-badge color="green">
              $ {{ props.row.price }}
            </q-badge>
          </q-td>
          <q-td key="quantity_sale" :props="props" class="w-c">
            <q-input
              :disable="!ecommerceStore.isActiveEvente"
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

    <q-table
      flat
      bordered
      :rows="planList"
      :columns="columnsM"
      row-key="name"
      hide-bottom
      class="v2"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props" class="w-c">
            {{ props.row.name }} <br>
            Entradas: {{ props.row.quantity_number }}
          </q-td>
          <q-td key="price" :props="props" class="w-c">
            <q-badge color="green">
              $ {{ props.row.price }}
            </q-badge>
          </q-td>
          <q-td key="quantity_sale" :props="props" class="w-c">
            <q-input
              :disable="!ecommerceStore.isActiveEvente"
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
        <div class="row">
          <div class="col-12 col-md-6">
            <VueClientRecaptcha
              :value="inputValue"
              @getCode="getCaptchaCode"
              @isValid="checkValidCaptcha"
            >
            <template #icon>
              <q-btn size="lg" icon="autorenew"
                    :style="'background: blue ; color: white'" />
            </template>
            </VueClientRecaptcha>
          </div>
          <div class="col-12 col-md-6">
            <q-item>
              <q-input dense outlined class="full-width" v-model="inputValue" label="Codigo Validación *"/>
            </q-item>
          </div>
        </div>
      </q-card-actions>
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
        <q-btn color="red" @click="onBuy()" :disable="!ecommerceStore.isActiveEvente" icon="shopping_cart_checkout" icon-right="send" label="Finalizar Compra" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<style scoped lang="scss">

  @media (max-width: 640px){
    .w-c {
      width: 50px;
    }

    .v1 {
      display: none;
    }
 }

 @media (min-width: 641px) {
    .v2 {
      display: none;
    }
 }


 @import url("/node_modules/vue-client-recaptcha/dist/style.css");
.sample-captcha {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.sample-captcha .data-box .input {
  padding: 10px;
  border: 1px solid #f1f1f1;
  border-radius: 4px;
  width: 100%;
}
.sample-captcha .data-box .input:focus {
  background: #f0f0f00d;
  outline: none;
  box-shadow: inset 0 -2px 0 #0077ff;
}
.sample-captcha .data-box .data {
  width: 100%;
  margin-top: 10px;
  padding: 20px 0 20px 20px;
  background-color: #ebebeb;
  border-radius: 4px;
}
.sample-captcha .captcha-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto;
}


</style>
