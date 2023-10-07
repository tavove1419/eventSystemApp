<script setup lang="ts">
  import {ref, onMounted} from 'vue'
  import { useQuasar } from 'quasar'
  import { useRouter } from 'vue-router'
  import { createCustomer, findCustommerIdentity, findOnePaymentCustomer, createPaymentDetail, createTicket, updatePaymentDetail, updateCustommer } from '../composables/useCustommerRegisterComposable'
  import { Custommer, PaymentDetailInterface, PlanInterface } from '../interfaces'
  import { useEcommerceStore } from '../store/ecommerce-store'

  const $q = useQuasar()
  const router = useRouter()
  const ecommerceStore = useEcommerceStore()
  const newCustommer = ref<Custommer>({
    id: '',
    name: '',
    last_name: '',
    identity: '',
    email: '',
    address: '',
    phone: '',
    phone2: '',
    city: '',
    province: '',
    country: ''
  })
  const newPaymentDetail = ref<PaymentDetailInterface>({
    id: '',
    identity_customer: '',
    card_name: '',
    card_number: '',
    cvv: '',
    expiration_date: ''
  })
  const document = ref<string>('')
  const id_payment = ref<string>('')
  const _id = ref<string>('')
  const step = ref<number>(1)
  const done1 = ref<boolean>(false)
  const done2 = ref<boolean>(false)
  const done3 = ref<boolean>(false)
  const planBuy = ref<PlanInterface>()

  //Datos formulario Detalle Pago
  const paymentDetailForm = ref({
    checkbox: <boolean | null> true,
    card_number: <string | null> null,
    expiration_date: <string | null> null,
    cvv: <string | null> null,
    card_name: <string | null> null,
  })

  //Datos formulario compra
  // const ticketForm = ref ({
  //   custommer_identity: <string | null> null,
  //   custommer_name: <string | null> null,
  //   custommer_email: <string | null> null,
  //   cant_number: <number | null> null,
  //   event_name: <string | null> null,
  //   event_date: <string | null> null,
  //   id_event: <string | null> null,
  // })

  //Datos formulario Cliente
  const custommerForm = ref ( {
    name: <string | null> null,
    last_name: <string | null> null,
    identity: <string | null> null,
    email: <string | null> null,
    address: <string | null> null,
    phone: <string | null> null,
    phone2: <string | null> null,
    city: <string | null> null,
    province: <string | null> null,
    country: <string | null> null,
    checkbox: <boolean | null> true,
  })

  onMounted(() => {
    console.log('pagos',ecommerceStore.data)
    planBuy.value = ecommerceStore.data
  })

  function onSubmit() {
    $q.loading.show({
      message: 'Guardando información...'
    })

    const valueCustommer = {
      name: custommerForm.value.name as string,
      last_name: custommerForm.value.last_name as string,
      identity: custommerForm.value.identity as string,
      email: custommerForm.value.email as string,
      address: custommerForm.value.address as string,
      phone: custommerForm.value.phone as string,
      phone2: custommerForm.value.phone2 ? custommerForm.value.phone2 as string : '',
      city: custommerForm.value.city as string,
      province: custommerForm.value.province as string,
      country: custommerForm.value.country as string,
    }

    if(_id.value.length)
      return done1.value = true, step.value = 2, $q.loading.hide(), loadPaymentDetail(), onUpdateCustommer(_id.value, valueCustommer)

    createCustomer(valueCustommer).then((response) => {
      newCustommer.value = response.data
      notify('Información cliente con exito!', 'positive')
      $q.loading.hide()
      done1.value = true
      step.value = 2
      loadPaymentDetail()
    }).catch(() => {
      notify('Revisar que la información este completa', 'negative')
      $q.loading.hide()
      step.value = 1
    })
  }

  function onUpdateCustommer(id: string, dataCustommer: Custommer): void {
    updateCustommer(id, dataCustommer).then((response) => {
      newCustommer.value = response.data
      notify('Información cliente con exito!', 'positive')
      $q.loading.hide()
    }).catch(() => {
      notify('Revisar que la información este completa', 'negative')
      $q.loading.hide()
      step.value = 1
    })
  }

  function onPaymentDetail() {
    $q.loading.show({
      message: 'Validando detalle de pago...'
    })
    document.value = custommerForm.value.identity as string
    const paymentDetail = {
      identity_customer: document.value as string,
      card_name: paymentDetailForm.value.card_name as string,
      card_number: paymentDetailForm.value.card_number as string,
      cvv: paymentDetailForm.value.cvv as string,
      expiration_date: paymentDetailForm.value.expiration_date as string
    }
    if (id_payment.value.length) {
      onUpdatePaymentDetail(id_payment.value, paymentDetail)
    } else {
      createPaymentDetail(paymentDetail).then((response) => {
        newPaymentDetail.value = response.data
        notify('Detalle de pago con exito!', 'positive')
        $q.loading.hide()
        done2.value = true
        step.value = 3
      }).catch(() => {
        notify('Revisar que la información este completa', 'negative')
        $q.loading.hide()
        step.value = 2
      })
    }
  }

  function onUpdatePaymentDetail(id: string, dataPayment: PaymentDetailInterface): void {
    updatePaymentDetail(id, dataPayment).then((response) => {
      newPaymentDetail.value = response.data
      notify('Detalle de pago con exito!', 'positive')
      $q.loading.hide()
      done2.value = true
      step.value = 3
    }).catch(() => {
      notify('Revisar que la información este completa', 'negative')
      $q.loading.hide()
      step.value = 2
    })
  }

  function onBuy() {
    $q.loading.show({
      message: 'Realizando compra...'
    })
    document.value = custommerForm.value.identity as string
    const ticket = {
      custommer_identity: document.value as string,
      custommer_name: `${custommerForm.value.name} ${custommerForm.value.last_name}` as string,
      custommer_email: custommerForm.value.email as string,
      cant_number: planBuy.value?.quantity_number as number,
      ticket_number: '',
      event_name: 'Rifa Moto NMAX Modelo 2024',
      event_date: '31/10/2023',
      id_event: 'b619266d-759b-4dbf-adb7-9989490fdbbe',
    }
    createTicket(ticket).then((response) => {
      notify(response.data.message, 'positive')
      $q.loading.hide()
      onResetPaymentDetailForm()
      onReset()
      custommerForm.value.identity = null
      redirect()
    }).catch(() => {
      notify('Revisar que la información este completa', 'negative')
      $q.loading.hide()
      step.value = 3
    })
  }

  function onBlur() {
    document.value = custommerForm.value.identity as string
    $q.loading.show({
      message: 'Validando...'
    })
    findCustommerIdentity(document.value).then((response) => {
      $q.loading.hide()
      custommerForm.value = response.data
      custommerForm.value.checkbox = true
      _id.value = response.data.id
    }).catch(() => {
      onReset()
      $q.loading.hide()
      step.value = 1
    })
  }

  function notify(msg: string, type: string) {
    $q.notify({
      message: msg,
      type: type,
      position: 'top',
      timeout: 3000
    })
  }

  function onReset() {
    custommerForm.value = {
      name: null,
      last_name: null,
      identity: custommerForm.value.identity,
      email: null,
      address: null,
      phone: null,
      phone2: null,
      city: null,
      province: null,
      country: null,
      checkbox: true
    }
    _id.value = ''
  }

  function onResetPaymentDetailForm() {
    paymentDetailForm.value = {
      card_number: null,
      expiration_date: null,
      cvv: null,
      card_name: null,
      checkbox: true
    }
  }

  function loadPaymentDetail() {
    document.value = custommerForm.value.identity as string
    $q.loading.show({
      message: 'Cargando detalles...'
    })
    findOnePaymentCustomer(document.value).then((response) => {
      $q.loading.hide()
      if(response.data)
        paymentDetailForm.value = response.data
      paymentDetailForm.value.checkbox = true
      id_payment.value = response.data.id
    }).catch(() => {
      $q.loading.hide()
      onResetPaymentDetailForm()
      id_payment.value = ''
    })
  }

  function redirect(): void {
    router.push('/')
  }
</script>

<template>
  <q-page class="q-pa-sm bg-white">
    <div class="row q-col-gutter-sm">
      <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
        <q-stepper
          v-model="step"
          header-nav
          ref="stepper"
          color="primary"
          animated
        >
          <q-step
            :name="1"
            title="Datos de compra"
            icon="shopping_cart"
            :done="step > 1"
            :header-nav="step > 1"
          >
            <div class="row">
              <div class="col-12">
                <q-item>
                  <q-input
                    dense
                    outlined
                    class="full-width"
                    v-model="custommerForm.identity"
                    label="Numero Documento *"
                    lazy-rules
                    :rules="[(val: []) => val && val.length > 0 || 'Ingresar numero de documento']"
                    @blur="onBlur()"
                  />
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense outlined class="full-width" v-model="custommerForm.name" label="Nombres *"/>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense outlined class="full-width" v-model="custommerForm.last_name" label="Apellidos *"/>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense autogrow outlined v-model="custommerForm.email" class="full-width"
                            label="Correo Electrónico *"/>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense autogrow outlined v-model="custommerForm.address" class="full-width"
                           label="Dirreción *"/>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense outlined class="full-width" mask="(###) ### - ####" hint="Eje: (300) 000 - 0000"  v-model="custommerForm.phone" label="Telefono Principal (whatsapp) *"/>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense outlined class="full-width" mask="(###) ### - ####" hint="Eje: (300) 000 - 0000"  v-model="custommerForm.phone2" label="Telefono Opcional"/>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense outlined class="full-width" v-model="custommerForm.city" label="Ciudad *"/>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense outlined class="full-width" v-model="custommerForm.province" label="Departamento"/>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense outlined class="full-width" v-model="custommerForm.country" label="País *"/>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-checkbox dense outlined class="full-width" v-model="custommerForm.checkbox" label="usar esta información para los datos de pago"/>
                </q-item>
              </div>
            </div>

            <q-stepper-navigation>
              <q-btn rounded @click="onSubmit()" class="float-right q-mr-md q-mb-md" color="blue"
                     label="Siguiente"/>
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="2"
            title="Detalles Pago"
            icon="shopping_cart"
            :done="step > 2"
            :header-nav="step > 2"
          >

            <div class="row">
              <div class="col-6">
                <q-item>
                  <q-input dense outlined class="full-width" v-model="paymentDetailForm.card_name" label="Nombre de la tarjeta*"/>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense outlined class="full-width" v-model="paymentDetailForm.card_number"
                           label="Número de Tarjeta *"/>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense autogrow outlined v-model="paymentDetailForm.expiration_date" class="full-width"
                           label="Fecha Vencimiento *"/>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense autogrow outlined v-model="paymentDetailForm.cvv" class="full-width" label="CVV *"/>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-checkbox dense outlined class="full-width" v-model="paymentDetailForm.checkbox"
                              label="Recuerde los datos de la tarjeta de crédito para la próxima vez"/>
                </q-item>
              </div>
            </div>

            <q-stepper-navigation>
              <q-btn rounded @click="onPaymentDetail()" class="float-right q-mr-md q-mb-md" color="blue"
                     label="Siguiente"/>
              <q-btn flat @click="step = 1" color="primary" rounded label="Regresar" class="q-mr-sm float-right"/>
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="3"
            title="Revise su compra"
            icon="shopping_cart"
            :header-nav="step > 3"
          >
            <div class="row">
              <div class="col-12">
                <q-item-label header class="text-h6">Resumen de la Compra</q-item-label>
                <q-item class="full-width">
                  <q-item-section>
                    <q-item-label class="text-uppercase" lines="1">{{ planBuy?.name }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    ${{ planBuy?.price }}
                  </q-item-section>
                </q-item>

                <q-separator></q-separator>
                <q-item class="full-width" style="border-top: 3px dotted blue">
                  <q-item-section>
                    <q-item-label class="text-uppercase" lines="1">Total</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    ${{ planBuy?.price }}
                  </q-item-section>
                </q-item>
              </div>
            </div>

            <q-stepper-navigation>

              <q-btn rounded @click="done3 = true, onBuy()" class="float-right q-mr-md q-mb-md" color="blue"
                     label="Realizar Compra"/>
              <q-btn flat @click="step = 2" color="primary" rounded label="Regresar" class="q-mr-sm float-right"/>
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </div>
      <div class="col-lg-5 col-md-5 col-sm-12 col-xs-12">
        <q-card class="bg-grey-2">
          <q-card-section class="text-center text-h6 text-black ">
            <q-icon name="shopping_cart" class="q-mr-sm"/>
            Resumen de la Compra
          </q-card-section>
          <q-card-section horizontal>
            <q-card-section class="col-5 flex flex-center">
              <q-img height="80px"
                     class="rounded-borders"
                     src="https://cdn.quasar.dev/img/parallax2.jpg"
              />
            </q-card-section>
            <q-card-section class="">
              <div class="text-subtitle2 q-mt-sm text-uppercase">{{ planBuy?.name }}</div>
              <div class="text-subtitle2  q-mb-xs">${{ planBuy?.price }}</div>
            </q-card-section>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="row">
            <div class="  col-12 text-h6 full-width">
              <div class="float-right q-mr-md">
                Total : <span class="text-blue">${{ planBuy?.price }}</span></div>
            </div>
          </q-card-section>

        </q-card>
      </div>
    </div>

  </q-page>
</template>


<style scoped>

</style>