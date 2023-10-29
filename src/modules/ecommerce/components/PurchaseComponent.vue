<script setup lang="ts">
  import {ref, onMounted} from 'vue'
  import { useQuasar } from 'quasar'
  import { useRouter } from 'vue-router'
  import { createCustomer, findCustommerIdentity, findOnePaymentCustomer, createPaymentDetail, createTicket, updatePaymentDetail, updateCustommer } from '../composables/useCustommerRegisterComposable'
  import { Custommer, PaymentDetailInterface, PlanInterface } from '../interfaces'
  import { useEcommerceStore } from '../store/ecommerce-store'
  import { existCode } from 'src/modules/administration/composables'

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
  const codeReferrer = ref<string>('')
  const id_payment = ref<string>('')
  const _id = ref<string>('')
  const step = ref<number>(1)
  const done1 = ref<boolean>(false)
  const done2 = ref<boolean>(false)
  const done3 = ref<boolean>(false)
  const planBuy = ref<PlanInterface[]>([])
  const number_total = ref<number>(0)
  const total = ref<number>(0)

  //Datos formulario Detalle Pago
  const paymentDetailForm = ref({
    checkbox: <boolean | null> true,
    card_number: <string | null> null,
    expiration_date: <string | null> null,
    cvv: <string | null> null,
    card_name: <string | null> null,
  })

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
    country: <string | null> ('Colombia'),
    checkbox: <boolean | null> true,
    reference: <string | null> null
  })

  onMounted(() => {
    planBuy.value = ecommerceStore.data
    total.value = ecommerceStore.totalBuy
    for (const data of planBuy.value) {
      const number = data.quantity_sale ? data.quantity_sale : 1
      number_total.value = number_total.value + (data.quantity_number * number)
    }
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
      reference: custommerForm.value.reference ? custommerForm.value.reference as string : '' ,
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
      cant_number: number_total.value as number,
      ticket_number: '',
      event_name: ecommerceStore.activeEvent.name,
      event_date: '31/10/2023',
      id_event: ecommerceStore.activeEvent.id as  string,
      code_referrer: custommerForm.value.reference,
      price_sale: total.value.toString()
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
      custommerForm.value.reference = ''
      _id.value = response.data.id
    }).catch(() => {
      onReset()
      $q.loading.hide()
    })
  }

  function onBlurCode() {
    codeReferrer.value = custommerForm.value.reference as string
    $q.loading.show({
      message: 'Validando...'
    })
    if (codeReferrer.value !== '' && codeReferrer.value !== null) {
      existCode(codeReferrer.value).then((response) => {
        custommerForm.value.reference = response.data.toString()
      }).catch((error) => {
        notify(error?.message ? error.message : 'Código de Referencia invalida', 'warning')
        custommerForm.value.reference = ''
        step.value = 1
      }).finally(() => $q.loading.hide())
    }
    $q.loading.hide()
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
      checkbox: true,
      reference: null
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

  function isValidEmail(val: string) {
    const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(val) || 'El correo no parece ser válido';
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
              <div class="col-12 col-md-6">
                <q-item>
                  <q-input dense lazy-rules
                    :rules="[(val: []) => val && val.length > 0 || 'Ingresar nombres']" outlined class="full-width" v-model="custommerForm.name" label="Nombres *"/>
                </q-item>
              </div>
              <div class="col-12 col-md-6">
                <q-item>
                  <q-input dense outlined class="full-width"
                    lazy-rules
                    :rules="[(val: []) => val && val.length > 0 || 'Ingresar apellidos']" v-model="custommerForm.last_name" label="Apellidos *"/>
                </q-item>
              </div>
              <div class="col-12 col-md-6">
                <q-item>
                  <q-input dense autogrow outlined v-model="custommerForm.email" class="full-width"
                    lazy-rules
                    :rules="[(val: []) => val && val.length > 0 || 'Ingresar correo', isValidEmail]"
                    label="Correo Electrónico *"
                  />
                </q-item>
              </div>
              <div class="col-12 col-md-6">
                <q-item>
                  <q-input dense autogrow outlined v-model="custommerForm.address" class="full-width"
                    lazy-rules
                    :rules="[(val: []) => val && val.length > 0 || 'Ingresar dirección']" label="Dirreción *"/>
                </q-item>
              </div>
              <div class="col-12 col-md-6">
                <q-item>
                  <q-input dense outlined class="full-width" mask="(###) ### - ####" hint="Eje: (300) 000 - 0000" lazy-rules
                    :rules="[(val: []) => val && val.length > 0 || 'Ingresar telefono']" v-model="custommerForm.phone" label="Telefono Principal (whatsapp) *"/>
                </q-item>
              </div>
              <div class="col-12 col-md-6">
                <q-item>
                  <q-input dense outlined class="full-width" mask="(###) ### - ####" hint="Eje: (300) 000 - 0000"  v-model="custommerForm.phone2" label="Telefono Opcional"/>
                </q-item>
              </div>
              <div class="col-12 col-md-6">
                <q-item>
                  <q-input dense outlined class="full-width" v-model="custommerForm.city" lazy-rules
                    :rules="[(val: []) => val && val.length > 0 || 'Ingresar ciudad']" label="Ciudad *"/>
                </q-item>
              </div>
              <div class="col-12 col-md-6">
                <q-item>
                  <q-input dense outlined class="full-width" lazy-rules
                    :rules="[(val: []) => val && val.length > 0 || 'Ingresar departamento']" v-model="custommerForm.province" label="Departamento *"/>
                </q-item>
              </div>
              <div class="col-12 col-md-6">
                <q-item>
                  <q-input dense outlined class="full-width" disable v-model="custommerForm.country" label="País *"/>
                </q-item>
              </div>
              <div class="col-12 col-md-6">
                <q-item>
                  <q-input dense autogrow outlined mask="######" v-model="custommerForm.reference" class="full-width"
                           label="Código Referido" @blur="onBlurCode()"/>
                </q-item>
              </div>
              <div class="col-12 col-md-6">
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
              <div class="col-12 col-md-6">
                <q-item>
                  <q-input dense outlined class="full-width" v-model="paymentDetailForm.card_name" label="Nombre de la tarjeta*"/>
                </q-item>
              </div>
              <div class="col-12 col-md-6">
                <q-item>
                  <q-input dense outlined class="full-width" v-model="paymentDetailForm.card_number"
                           label="Número de Tarjeta *"/>
                </q-item>
              </div>
              <div class="col-12 col-md-6">
                <q-item>
                  <q-input dense autogrow outlined v-model="paymentDetailForm.expiration_date" class="full-width" mask="##/##"
                           label="Fecha Vencimiento *"/>
                </q-item>
              </div>
              <div class="col-12 col-md-6">
                <q-item>
                  <q-input dense autogrow outlined v-model="paymentDetailForm.cvv" mask="###" class="full-width" label="CVV *"/>
                </q-item>
              </div>
              <div class="col-12 col-md-6">
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
              <q-item-label header class="text-h6">Resumen de la Compra</q-item-label>
              <div class="col-12" v-for="plan in planBuy" :key="plan.name">
                <q-item class="full-width">
                  <q-item-section>
                    <q-item-label class="text-uppercase" lines="1">{{ plan?.name }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    ${{ plan?.price * (plan?.quantity_sale ? plan?.quantity_sale : 1) }}
                  </q-item-section>
                </q-item>
              </div>
              <q-separator></q-separator>
              <q-item class="full-width" style="border-top: 3px dotted blue">
                <q-item-section>
                  <q-item-label class="text-uppercase" lines="1">Total</q-item-label>
                </q-item-section>
                <q-item-section side>
                  ${{ total }}
                </q-item-section>
              </q-item>
            </div>
            <q-stepper-navigation>
            <q-btn rounded @click="done3 = true, onBuy()" class="float-right q-mr-md q-mb-md" color="blue" label="Realizar Compra"/>
            <q-btn flat @click="step = 2" color="primary" rounded label="Regresar" class="q-mr-sm float-right"/>
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </div>
      <div class="col-lg-5 col-md-5 col-sm-12 col-xs-12">
        <q-card class="bg-grey-2" >
          <q-card-section class="text-center text-h6 text-black ">
            <q-icon name="shopping_cart" class="q-mr-sm"/>
            Resumen de la Compra
          </q-card-section>
          <q-card-section horizontal v-for="plan in planBuy" :key="plan.name">
            <q-card-section class="col-5 flex flex-center">
              <q-img

                sizes="(max-width: 400px) 400w,
                (min-width: 400px) and (max-width: 800px) 800w,
                (min-width: 800px) and (max-width: 1200px) 1200w,
                (min-width: 1200px) 1600w"
                class="rounded-borders img-pequeña"
                src="../../../assets/buy.png"
              />
            </q-card-section>
            <q-card-section class="">
              <div class="text-subtitle2 q-mt-sm text-uppercase">{{ plan?.name }}</div>
              <div class="text-subtitle2  q-mb-xs"><q-icon color="green" name="currency_exchange" /> {{ plan?.price }}</div>
              <div class="text-subtitle2  q-mb-xs">Cantidad <q-icon color="green" name="shopping_cart" /> {{ plan?.quantity_sale }}</div>
              <div class="text-subtitle2  q-mb-xs">Subtotal <q-icon color="green" name="currency_exchange" /> {{ plan?.price * (plan?.quantity_sale ? plan?.quantity_sale : 1) }}</div>
            </q-card-section>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="row">
            <div class="  col-12 text-h6 full-width">
              <div class="float-right q-mr-md">
                Total : <span class="text-blue">$ {{ total }}</span>
              </div>
            </div>
          </q-card-section>

        </q-card>
      </div>
    </div>

  </q-page>
</template>


<style scoped>
  .img-pequeña{
    width: 100px;
    height: 100px;
  }
</style>
