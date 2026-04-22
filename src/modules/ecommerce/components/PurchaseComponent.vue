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
  <div class="pc-root">
    <div class="pc-layout">

      <!-- ════════════════════════════════════════
           COLUMNA IZQUIERDA — Stepper de formulario
           ════════════════════════════════════════ -->
      <div class="pc-form-col">

        <!-- Stepper visual custom -->
        <div class="pc-steps">
          <div
            v-for="(s, i) in [
              { label: 'Datos personales', icon: 'person' },
              { label: 'Detalle de pago',  icon: 'credit_card' },
              { label: 'Confirmar compra', icon: 'check_circle' }
            ]"
            :key="i"
            class="pc-step"
            :class="{
              'pc-step--active': step === i + 1,
              'pc-step--done':   step > i + 1
            }"
          >
            <div class="pc-step__circle">
              <q-icon v-if="step > i + 1" name="check" size="16px" />
              <q-icon v-else :name="s.icon" size="16px" />
            </div>
            <span class="pc-step__label">{{ s.label }}</span>
            <div v-if="i < 2" class="pc-step__line" />
          </div>
        </div>

        <!-- ── PASO 1: Datos personales ─────────── -->
        <transition name="step-fade" mode="out-in">
          <div v-if="step === 1" key="step1" class="pc-panel">
            <div class="pc-panel__header">
              <div class="pc-panel__icon-wrap">
                <q-icon name="person" size="20px" />
              </div>
              <div>
                <h2 class="pc-panel__title">Datos personales</h2>
                <p class="pc-panel__sub">Ingresa tu información para registrar la compra</p>
              </div>
            </div>

            <div class="pc-form-grid">
              <!-- Documento (full width) -->
              <div class="pc-field pc-field--full">
                <q-input
                  dark dense outlined color="orange"
                  v-model="custommerForm.identity"
                  label="Número de Documento *"
                  lazy-rules
                  :rules="[(val: []) => val && val.length > 0 || 'Ingresar número de documento']"
                  @blur="onBlur()"
                  class="pc-input"
                >
                  <template #prepend><q-icon name="badge" color="orange" size="18px"/></template>
                </q-input>
              </div>

              <div class="pc-field">
                <q-input dark dense outlined color="orange"
                  lazy-rules :rules="[(val: []) => val && val.length > 0 || 'Ingresar nombres']"
                  v-model="custommerForm.name" label="Nombres *" class="pc-input">
                  <template #prepend><q-icon name="person" color="orange" size="18px"/></template>
                </q-input>
              </div>

              <div class="pc-field">
                <q-input dark dense outlined color="orange"
                  lazy-rules :rules="[(val: []) => val && val.length > 0 || 'Ingresar apellidos']"
                  v-model="custommerForm.last_name" label="Apellidos *" class="pc-input">
                  <template #prepend><q-icon name="person_outline" color="orange" size="18px"/></template>
                </q-input>
              </div>

              <div class="pc-field">
                <q-input dark dense outlined color="orange"
                  lazy-rules :rules="[(val: []) => val && val.length > 0 || 'Ingresar correo', isValidEmail]"
                  v-model="custommerForm.email" label="Correo Electrónico *" class="pc-input">
                  <template #prepend><q-icon name="email" color="orange" size="18px"/></template>
                </q-input>
              </div>

              <div class="pc-field">
                <q-input dark dense outlined color="orange"
                  lazy-rules :rules="[(val: []) => val && val.length > 0 || 'Ingresar dirección']"
                  v-model="custommerForm.address" label="Dirección *" class="pc-input">
                  <template #prepend><q-icon name="home" color="orange" size="18px"/></template>
                </q-input>
              </div>

              <div class="pc-field">
                <q-input dark dense outlined color="orange"
                  mask="(###) ### - ####" hint="Eje: (300) 000 - 0000"
                  lazy-rules :rules="[(val: []) => val && val.length > 0 || 'Ingresar teléfono']"
                  v-model="custommerForm.phone" label="Teléfono Principal (WhatsApp) *" class="pc-input">
                  <template #prepend><q-icon name="whatsapp" color="orange" size="18px"/></template>
                </q-input>
              </div>

              <div class="pc-field">
                <q-input dark dense outlined color="orange"
                  mask="(###) ### - ####" hint="Eje: (300) 000 - 0000"
                  v-model="custommerForm.phone2" label="Teléfono Opcional" class="pc-input">
                  <template #prepend><q-icon name="phone" color="orange" size="18px"/></template>
                </q-input>
              </div>

              <div class="pc-field">
                <q-input dark dense outlined color="orange"
                  lazy-rules :rules="[(val: []) => val && val.length > 0 || 'Ingresar ciudad']"
                  v-model="custommerForm.city" label="Ciudad *" class="pc-input">
                  <template #prepend><q-icon name="location_city" color="orange" size="18px"/></template>
                </q-input>
              </div>

              <div class="pc-field">
                <q-input dark dense outlined color="orange"
                  lazy-rules :rules="[(val: []) => val && val.length > 0 || 'Ingresar departamento']"
                  v-model="custommerForm.province" label="Departamento *" class="pc-input">
                  <template #prepend><q-icon name="map" color="orange" size="18px"/></template>
                </q-input>
              </div>

              <div class="pc-field">
                <q-input dark dense outlined color="orange"
                  v-model="custommerForm.country" label="País *" class="pc-input">
                  <template #prepend><q-icon name="public" color="orange" size="18px"/></template>
                </q-input>
              </div>

              <div class="pc-field">
                <q-input dark dense outlined color="orange"
                  mask="######" v-model="custommerForm.reference"
                  label="Código Referido" @blur="onBlurCode()" class="pc-input">
                  <template #prepend><q-icon name="card_giftcard" color="orange" size="18px"/></template>
                </q-input>
              </div>

              <div class="pc-field pc-field--full">
                <q-checkbox
                  dark dense
                  v-model="custommerForm.checkbox"
                  color="orange"
                  label="Usar esta información para los datos de pago"
                  class="pc-checkbox"
                />
              </div>
            </div>

            <div class="pc-panel__actions">
              <button class="pc-btn pc-btn--primary" @click="onSubmit()">
                <span>Siguiente</span>
                <q-icon name="arrow_forward" size="18px" />
              </button>
            </div>
          </div>
        </transition>

        <!-- ── PASO 2: Detalle de Pago ──────────── -->
        <transition name="step-fade" mode="out-in">
          <div v-if="step === 2" key="step2" class="pc-panel">
            <div class="pc-panel__header">
              <div class="pc-panel__icon-wrap pc-panel__icon-wrap--red">
                <q-icon name="credit_card" size="20px" />
              </div>
              <div>
                <h2 class="pc-panel__title">Detalle de pago</h2>
                <p class="pc-panel__sub">Ingresa los datos de tu tarjeta de forma segura</p>
              </div>
            </div>

            <!-- Card preview -->
            <div class="card-preview">
              <div class="card-preview__chip">
                <q-icon name="credit_card" size="22px" />
              </div>
              <div class="card-preview__number">
                {{ paymentDetailForm.card_number
                  ? paymentDetailForm.card_number.replace(/(.{4})/g, '$1 ').trim()
                  : '•••• •••• •••• ••••' }}
              </div>
              <div class="card-preview__bottom">
                <div>
                  <span class="card-preview__micro">Titular</span>
                  <span class="card-preview__val">{{ paymentDetailForm.card_name || '— — — —' }}</span>
                </div>
                <div>
                  <span class="card-preview__micro">Vence</span>
                  <span class="card-preview__val">{{ paymentDetailForm.expiration_date || 'MM/AA' }}</span>
                </div>
                <div>
                  <span class="card-preview__micro">CVV</span>
                  <span class="card-preview__val">{{ paymentDetailForm.cvv ? '•••' : '•••' }}</span>
                </div>
              </div>
            </div>

            <div class="pc-form-grid">
              <div class="pc-field pc-field--full">
                <q-input dark dense outlined color="orange"
                  v-model="paymentDetailForm.card_name" label="Nombre en la Tarjeta *" class="pc-input">
                  <template #prepend><q-icon name="person" color="orange" size="18px"/></template>
                </q-input>
              </div>
              <div class="pc-field pc-field--full">
                <q-input dark dense outlined color="orange"
                  v-model="paymentDetailForm.card_number" label="Número de Tarjeta *" class="pc-input">
                  <template #prepend><q-icon name="credit_card" color="orange" size="18px"/></template>
                </q-input>
              </div>
              <div class="pc-field">
                <q-input dark dense outlined color="orange"
                  v-model="paymentDetailForm.expiration_date" mask="##/##"
                  label="Fecha de Vencimiento *" class="pc-input">
                  <template #prepend><q-icon name="calendar_today" color="orange" size="18px"/></template>
                </q-input>
              </div>
              <div class="pc-field">
                <q-input dark dense outlined color="orange"
                  v-model="paymentDetailForm.cvv" mask="###"
                  label="CVV *" class="pc-input">
                  <template #prepend><q-icon name="lock" color="orange" size="18px"/></template>
                </q-input>
              </div>
              <div class="pc-field pc-field--full">
                <q-checkbox dark dense v-model="paymentDetailForm.checkbox" color="orange"
                  label="Recordar datos de tarjeta para la próxima vez" class="pc-checkbox" />
              </div>
            </div>

            <div class="pc-panel__actions">
              <button class="pc-btn pc-btn--ghost" @click="step = 1">
                <q-icon name="arrow_back" size="18px" />
                <span>Regresar</span>
              </button>
              <button class="pc-btn pc-btn--primary" @click="onPaymentDetail()">
                <span>Siguiente</span>
                <q-icon name="arrow_forward" size="18px" />
              </button>
            </div>
          </div>
        </transition>

        <!-- ── PASO 3: Confirmación ─────────────── -->
        <transition name="step-fade" mode="out-in">
          <div v-if="step === 3" key="step3" class="pc-panel">
            <div class="pc-panel__header">
              <div class="pc-panel__icon-wrap pc-panel__icon-wrap--green">
                <q-icon name="check_circle" size="20px" />
              </div>
              <div>
                <h2 class="pc-panel__title">Confirmar compra</h2>
                <p class="pc-panel__sub">Revisa los detalles antes de finalizar</p>
              </div>
            </div>

            <div class="confirm-list">
              <div
                v-for="plan in planBuy"
                :key="plan.name"
                class="confirm-item"
              >
                <div class="confirm-item__left">
                  <div class="confirm-item__dot" />
                  <div class="confirm-item__info">
                    <span class="confirm-item__name">{{ plan?.name }}</span>
                    <span class="confirm-item__meta">
                      {{ plan?.quantity_sale }} unidad(es) · {{ plan?.quantity_number }} entradas c/u
                    </span>
                  </div>
                </div>
                <span class="confirm-item__price">
                  $ {{ (plan?.price * (plan?.quantity_sale ? plan?.quantity_sale : 1)).toLocaleString('es-CO') }}
                </span>
              </div>
            </div>

            <div class="confirm-total">
              <span class="confirm-total__label">Total a pagar</span>
              <span class="confirm-total__value">$ {{ total.toLocaleString('es-CO') }}</span>
            </div>

            <div class="pc-panel__actions">
              <button class="pc-btn pc-btn--ghost" @click="step = 2">
                <q-icon name="arrow_back" size="18px" />
                <span>Regresar</span>
              </button>
              <button class="pc-btn pc-btn--fire" @click="done3 = true, onBuy()">
                <q-icon name="local_fire_department" size="18px" />
                <span>Realizar Compra</span>
                <q-icon name="send" size="16px" style="margin-left:auto" />
              </button>
            </div>
          </div>
        </transition>

      </div>

      <!-- ════════════════════════════════════════
           COLUMNA DERECHA — Resumen lateral
           ════════════════════════════════════════ -->
      <div class="pc-summary-col">
        <div class="pc-summary">

          <div class="pc-summary__header">
            <q-icon name="shopping_bag" size="20px" class="pc-summary__icon" />
            <span>Resumen de la Compra</span>
          </div>

          <div class="pc-summary__items">
            <div
              v-for="(plan) in planBuy"
              :key="plan.name"
              class="pc-summary__item"
            >
              <div class="pc-summary__item-img">
                <q-img
                  src="../../../assets/buy.png"
                  fit="cover"
                  class="pc-summary__img"
                />
                <div class="pc-summary__item-badge">
                  {{ plan?.quantity_sale }}×
                </div>
              </div>
              <div class="pc-summary__item-info">
                <span class="pc-summary__item-name">{{ plan?.name }}</span>
                <span class="pc-summary__item-entries">
                  <q-icon name="confirmation_number" size="12px" />
                  {{ plan?.quantity_number }} entradas
                </span>
                <span class="pc-summary__item-price">
                  $ {{ plan?.price.toLocaleString('es-CO') }} / unidad
                </span>
              </div>
              <span class="pc-summary__item-sub">
                $ {{ (plan?.price * (plan?.quantity_sale ? plan?.quantity_sale : 1)).toLocaleString('es-CO') }}
              </span>
            </div>
          </div>

          <div class="pc-summary__divider" />

          <!-- Entradas totales -->
          <div class="pc-summary__stat">
            <div class="pc-summary__stat-item">
              <q-icon name="confirmation_number" size="16px" color="orange" />
              <span>Entradas totales</span>
              <strong>{{ number_total }}</strong>
            </div>
          </div>

          <div class="pc-summary__divider" />

          <div class="pc-summary__total">
            <span>Total</span>
            <span class="pc-summary__total-val">$ {{ total.toLocaleString('es-CO') }}</span>
          </div>

          <!-- Seguridad -->
          <div class="pc-summary__secure">
            <q-icon name="lock" size="13px" />
            <span>Pago cifrado y seguro</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
/* ── Tokens ──────────────────────────────────────────── */
$black:   #09090c;
$dark:    #111318;
$card:    #16181f;
$card2:   #1c1e28;
$border:  rgba(255,255,255,.07);
$border2: rgba(255,255,255,.13);
$orange:  #FF6B35;
$red:     #E63946;
$amber:   #FF9F1C;
$green:   #4ade80;
$tp:      #F2F2F5;
$tm:      #888A99;
$rlg:     14px;
$rxl:     20px;

/* ── Root & Layout ───────────────────────────────────── */
.pc-root {
  background: $black;
  min-height: 100vh;
  padding: 32px 24px 80px;
}

.pc-layout {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 28px;
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
}

/* ── Custom Stepper ──────────────────────────────────── */
.pc-steps {
  display: flex;
  align-items: flex-start;
  gap: 0;
  margin-bottom: 28px;
}

.pc-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
  flex: 1;

  &__circle {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,.06);
    border: 2px solid $border2;
    display: flex; align-items: center; justify-content: center;
    color: $tm; font-weight: 700; font-size: .85rem;
    transition: background .3s, border-color .3s, color .3s;
    z-index: 1;
  }

  &__label {
    font-size: .7rem; font-weight: 700;
    color: $tm; text-align: center;
    transition: color .3s;
    white-space: nowrap;
  }

  &__line {
    position: absolute;
    top: 17px; left: calc(50% + 18px);
    width: calc(100% - 36px);
    height: 2px;
    background: $border2;
    z-index: 0;
  }

  /* Active */
  &--active {
    .pc-step__circle {
      background: rgba(255,107,53,.15);
      border-color: $orange;
      color: $orange;
      box-shadow: 0 0 16px rgba(255,107,53,.3);
    }
    .pc-step__label { color: $orange; }
  }

  /* Done */
  &--done {
    .pc-step__circle {
      background: rgba(74,222,128,.12);
      border-color: $green;
      color: $green;
    }
    .pc-step__label { color: $green; }
    .pc-step__line { background: $green; }
  }
}

/* ── Panel (formulario por paso) ─────────────────────── */
.pc-panel {
  background: $dark;
  border: 1px solid $border;
  border-radius: $rxl;
  padding: 28px;

  &__header {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 24px;
  }

  &__icon-wrap {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(255,107,53,.12);
    border: 1px solid rgba(255,107,53,.25);
    display: flex; align-items: center; justify-content: center;
    color: $orange; flex-shrink: 0;

    &--red {
      background: rgba(230,57,70,.1);
      border-color: rgba(230,57,70,.25);
      color: $red;
    }
    &--green {
      background: rgba(74,222,128,.1);
      border-color: rgba(74,222,128,.25);
      color: $green;
    }
  }

  &__title {
    font-size: 1.05rem; font-weight: 800; color: $tp; margin: 0 0 3px;
  }
  &__sub {
    font-size: .8rem; color: $tm; margin: 0;
  }

  &__actions {
    display: flex; justify-content: flex-end; gap: 10px;
    margin-top: 24px; flex-wrap: wrap;
  }
}

/* ── Form grid ───────────────────────────────────────── */
.pc-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 560px) { grid-template-columns: 1fr; }
}

.pc-field { }
.pc-field--full { grid-column: 1 / -1; }

.pc-input {
  :deep(.q-field__control) {
    background: rgba(255,255,255,.04) !important;
    border-radius: 10px !important;
  }
  :deep(input) { color: $tp !important; font-weight: 500; }
  :deep(.q-field__label) { color: $tm !important; }
  :deep(.q-field__bottom) { color: $red !important; font-size: .72rem; }
}

.pc-checkbox {
  :deep(.q-checkbox__label) { color: $tm; font-size: .82rem; }
}

/* ── Buttons ─────────────────────────────────────────── */
.pc-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 22px; border-radius: 100px; border: none; cursor: pointer;
  font-size: .88rem; font-weight: 800; letter-spacing: .3px;
  transition: background .2s, transform .15s, box-shadow .2s;

  &--primary {
    background: linear-gradient(135deg, $orange, darken($orange, 10%));
    color: white;
    box-shadow: 0 4px 20px rgba(255,107,53,.3);
    &:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,107,53,.45); }
  }

  &--ghost {
    background: rgba(255,255,255,.06);
    color: $tm;
    border: 1px solid $border2;
    &:hover { background: rgba(255,255,255,.1); color: $tp; }
  }

  &--fire {
    background: linear-gradient(135deg, $orange 0%, $red 100%);
    color: white;
    box-shadow: 0 4px 24px rgba(230,57,70,.35);
    &:hover { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(255,107,53,.5); }
  }
}

/* ── Card preview ────────────────────────────────────── */
.card-preview {
  background: linear-gradient(135deg, #1a1020 0%, #2a1520 50%, #1a0a15 100%);
  border: 1px solid rgba(255,107,53,.2);
  border-radius: 16px; padding: 20px 22px;
  margin-bottom: 20px; position: relative; overflow: hidden;

  &::before {
    content: '';
    position: absolute; top: -40px; right: -40px;
    width: 140px; height: 140px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,107,53,.15), transparent 70%);
  }

  &__chip {
    color: $amber; margin-bottom: 16px;
  }

  &__number {
    font-size: 1.1rem; font-weight: 800; color: $tp;
    letter-spacing: 2px; font-family: monospace;
    margin-bottom: 16px;
  }

  &__bottom {
    display: flex; gap: 24px; flex-wrap: wrap;
  }

  &__micro {
    display: block; font-size: .65rem; color: $tm;
    text-transform: uppercase; letter-spacing: .8px; margin-bottom: 2px;
  }

  &__val {
    font-size: .82rem; font-weight: 700; color: $tp;
    font-family: monospace;
  }
}

/* ── Step 3: Confirm list ────────────────────────────── */
.confirm-list {
  display: flex; flex-direction: column; gap: 10px;
  margin-bottom: 20px;
}

.confirm-item {
  display: flex; align-items: center;
  justify-content: space-between; gap: 12px;
  padding: 14px 16px;
  background: rgba(255,255,255,.03);
  border: 1px solid $border;
  border-radius: $rlg;
  transition: border-color .2s;
  &:hover { border-color: $border2; }

  &__left { display: flex; align-items: center; gap: 10px; }
  &__dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: $orange; flex-shrink: 0;
  }
  &__info { display: flex; flex-direction: column; gap: 2px; }
  &__name { font-size: .88rem; font-weight: 700; color: $tp; }
  &__meta { font-size: .73rem; color: $tm; }
  &__price { font-size: .9rem; font-weight: 900; color: $amber; white-space: nowrap; }
}

.confirm-total {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 0 0;
  border-top: 2px dashed rgba(255,107,53,.3);
  margin-top: 8px;

  &__label { font-size: .85rem; font-weight: 700; color: $tm; }
  &__value {
    font-size: 1.45rem; font-weight: 900;
    color: $orange;
    text-shadow: 0 0 24px rgba(255,107,53,.4);
  }
}

/* ── Summary sidebar ─────────────────────────────────── */
.pc-summary-col { position: sticky; top: 80px; }

.pc-summary {
  background: $dark;
  border: 1px solid $border;
  border-radius: $rxl;
  overflow: hidden;

  &__header {
    display: flex; align-items: center; gap: 10px;
    padding: 18px 20px;
    background: rgba(255,107,53,.07);
    border-bottom: 1px solid rgba(255,107,53,.15);
    font-size: .8rem; font-weight: 800; color: $orange;
    text-transform: uppercase; letter-spacing: .8px;
  }

  &__icon { color: $orange; }

  &__items {
    display: flex; flex-direction: column;
    padding: 16px 20px; gap: 14px;
  }

  &__item {
    display: flex; align-items: flex-start; gap: 12px;
  }

  &__item-img {
    position: relative; flex-shrink: 0;
  }

  &__img {
    width: 52px; height: 52px;
    border-radius: 10px;
    border: 1px solid $border;
  }

  &__item-badge {
    position: absolute; top: -6px; right: -6px;
    background: $orange; color: white;
    font-size: .65rem; font-weight: 800;
    padding: 2px 5px; border-radius: 100px;
    border: 1.5px solid $dark;
  }

  &__item-info {
    flex: 1; display: flex; flex-direction: column; gap: 3px;
  }

  &__item-name  { font-size: .85rem; font-weight: 700; color: $tp; }
  &__item-entries {
    display: flex; align-items: center; gap: 4px;
    font-size: .72rem; color: $tm;
    .q-icon { color: $amber; }
  }
  &__item-price { font-size: .72rem; color: $tm; }

  &__item-sub {
    font-size: .85rem; font-weight: 800; color: $tp; white-space: nowrap;
  }

  &__divider { height: 1px; background: $border; margin: 0 20px; }

  &__stat { padding: 14px 20px; }
  &__stat-item {
    display: flex; align-items: center; gap: 8px;
    font-size: .82rem; color: $tm;
    strong { color: $tp; font-weight: 800; margin-left: auto; }
  }

  &__total {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px;
  }
  &__total span:first-child { font-size: .85rem; font-weight: 700; color: $tm; }
  &__total-val {
    font-size: 1.3rem; font-weight: 900; color: $orange;
    text-shadow: 0 0 20px rgba(255,107,53,.35);
  }

  &__secure {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 12px 20px 16px;
    font-size: .72rem; color: $tm;
    border-top: 1px solid $border;
    .q-icon { color: $green; }
  }
}

/* ── Transition ──────────────────────────────────────── */
.step-fade-enter-active, .step-fade-leave-active {
  transition: opacity .25s ease, transform .25s ease;
}
.step-fade-enter-from {
  opacity: 0; transform: translateX(16px);
}
.step-fade-leave-to {
  opacity: 0; transform: translateX(-16px);
}

.img-pequeña {
  width: 100px;
  height: 100px;
}
</style>
