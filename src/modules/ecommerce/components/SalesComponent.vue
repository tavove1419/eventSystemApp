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
  const inputValue = ref<string>('');
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
  <div class="sc-root">

    <!-- ══════════ TABLA DESKTOP (≥ 641px) ═══════════ -->
    <div class="sc-table-wrap v1">
      <div class="sc-table-header">
        <span class="sc-table-header__cell">Plan</span>
        <span class="sc-table-header__cell">Entradas</span>
        <span class="sc-table-header__cell">Precio</span>
        <span class="sc-table-header__cell">Cantidad</span>
      </div>

      <div
        v-for="(row, index) in planList"
        :key="row.id"
        class="sc-table-row"
        :class="{ 'sc-table-row--selected': row.quantity_sale && row.quantity_sale > 0 }"
      >
        <!-- Plan name -->
        <div class="sc-table-cell">
          <div class="plan-name-wrap">
            <div class="plan-dot" :style="`background: ${['#FF6B35','#E63946','#FF9F1C','#C1121F'][index % 4]}`" />
            <span class="plan-name">{{ row.name }}</span>
          </div>
        </div>

        <!-- Entradas -->
        <div class="sc-table-cell">
          <span class="entries-badge">
            <q-icon name="confirmation_number" size="13px" />
            {{ row.quantity_number }}
          </span>
        </div>

        <!-- Precio -->
        <div class="sc-table-cell">
          <span class="price-badge">$ {{ row.price.toLocaleString('es-CO') }}</span>
        </div>

        <!-- Cantidad -->
        <div class="sc-table-cell">
          <div class="qty-ctrl">
            <button
              class="qty-btn"
              :disabled="!ecommerceStore.isActiveEvente || !row.quantity_sale || row.quantity_sale <= 0"
              @click="row.quantity_sale = Math.max(0, (row.quantity_sale || 0) - 1); onBlur(row.quantity_sale)"
            >
              <q-icon name="remove" size="14px" />
            </button>
            <input
              class="qty-input"
              type="number"
              :disabled="!ecommerceStore.isActiveEvente"
              v-model.number="row.quantity_sale"
              min="0"
              @input="onBlur(row.quantity_sale || 0)"
            />
            <button
              class="qty-btn qty-btn--plus"
              :disabled="!ecommerceStore.isActiveEvente"
              @click="row.quantity_sale = (row.quantity_sale || 0) + 1; onBlur(row.quantity_sale)"
            >
              <q-icon name="add" size="14px" />
            </button>
          </div>
        </div>

        <!-- Subtotal fila -->
        <transition name="fade">
          <div v-if="row.quantity_sale && row.quantity_sale > 0" class="sc-table-row__sub">
            Subtotal: <strong>$ {{ (row.price * row.quantity_sale).toLocaleString('es-CO') }}</strong>
          </div>
        </transition>
      </div>
    </div>

    <!-- ══════════ TABLA MOBILE (≤ 640px) ════════════ -->
    <div class="sc-table-wrap v2">
      <div
        v-for="(row, index) in planList"
        :key="row.id"
        class="sc-mobile-card"
        :class="{ 'sc-mobile-card--selected': row.quantity_sale && row.quantity_sale > 0 }"
        :style="`--accent: ${['#FF6B35','#E63946','#FF9F1C','#C1121F'][index % 4]}`"
      >
        <div class="sc-mobile-card__top">
          <div class="sc-mobile-card__info">
            <span class="plan-name">{{ row.name }}</span>
            <span class="entries-badge entries-badge--sm">
              <q-icon name="confirmation_number" size="12px" />
              {{ row.quantity_number }} entradas
            </span>
          </div>
          <span class="price-badge">$ {{ row.price.toLocaleString('es-CO') }}</span>
        </div>
        <div class="sc-mobile-card__bottom">
          <span class="qty-label">Cantidad</span>
          <div class="qty-ctrl">
            <button
              class="qty-btn"
              :disabled="!ecommerceStore.isActiveEvente || !row.quantity_sale || row.quantity_sale <= 0"
              @click="row.quantity_sale = Math.max(0, (row.quantity_sale || 0) - 1); onBlur(row.quantity_sale)"
            >
              <q-icon name="remove" size="14px" />
            </button>
            <input
              class="qty-input"
              type="number"
              :disabled="!ecommerceStore.isActiveEvente"
              v-model.number="row.quantity_sale"
              min="0"
              @input="onBlur(row.quantity_sale || 0)"
            />
            <button
              class="qty-btn qty-btn--plus"
              :disabled="!ecommerceStore.isActiveEvente"
              @click="row.quantity_sale = (row.quantity_sale || 0) + 1; onBlur(row.quantity_sale)"
            >
              <q-icon name="add" size="14px" />
            </button>
          </div>
        </div>
        <transition name="fade">
          <div v-if="row.quantity_sale && row.quantity_sale > 0" class="sc-mobile-card__sub">
            Subtotal: <strong>$ {{ (row.price * row.quantity_sale).toLocaleString('es-CO') }}</strong>
          </div>
        </transition>
      </div>
    </div>

    <!-- ══════════ PANEL CAPTCHA + TOTAL + CTA ════════ -->
    <div class="sc-checkout">

      <!-- Captcha -->
      <div class="sc-captcha">
        <p class="sc-captcha__label">
          <q-icon name="security" size="15px" />
          Verificación de seguridad
        </p>
        <div class="sc-captcha__body">
          <div class="sc-captcha__widget">
            <VueClientRecaptcha
              :value="inputValue"
              @getCode="getCaptchaCode"
              @isValid="checkValidCaptcha"
            >
              <template #icon>
                <button class="captcha-refresh-btn">
                  <q-icon name="autorenew" size="18px" />
                </button>
              </template>
            </VueClientRecaptcha>
          </div>
          <div class="sc-captcha__input-wrap">
            <q-input
              dense outlined dark
              color="orange"
              v-model="inputValue"
              label="Código de validación *"
              class="sc-captcha__input"
            >
              <template #prepend>
                <q-icon name="lock" size="16px" color="orange" />
              </template>
              <template #append v-if="data.isValid">
                <q-icon name="check_circle" color="positive" size="18px" />
              </template>
            </q-input>
            <transition name="fade">
              <p v-if="data.isValid" class="captcha-ok">
                <q-icon name="verified" size="13px" /> Código verificado correctamente
              </p>
            </transition>
          </div>
        </div>
      </div>

      <div class="sc-checkout__divider" />

      <!-- Total + Botón -->
      <div class="sc-checkout__bottom">
        <div class="sc-total">
          <span class="sc-total__label">Total a pagar</span>
          <span class="sc-total__value" :class="{ 'sc-total__value--active': subtotal > 0 }">
            $ {{ subtotal.toLocaleString('es-CO') }}
          </span>
        </div>

        <button
          class="sc-buy-btn"
          :class="{ 'sc-buy-btn--active': subtotal > 0 && data.isValid }"
          :disabled="!ecommerceStore.isActiveEvente"
          @click="onBuy()"
        >
          <q-icon name="shopping_cart_checkout" size="20px" />
          <span>Finalizar Compra</span>
          <q-icon name="send" size="17px" class="sc-buy-btn__arrow" />
        </button>

        <p v-if="!ecommerceStore.isActiveEvente" class="sc-inactive-msg">
          <q-icon name="info" size="13px" /> No hay un evento activo en este momento
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
/* ── Tokens ──────────────────────────────────────────── */
$black:   #0a0a0a;
$dark:    #111318;
$card:    #18191f;
$card2:   #1f2029;
$border:  rgba(255,255,255,.07);
$border2: rgba(255,255,255,.13);
$orange:  #FF6B35;
$red:     #E63946;
$amber:   #FF9F1C;
$tp:      #F2F2F5;
$tm:      #888A99;
$rlg:     14px;
$rxl:     20px;

/* ── Root ────────────────────────────────────────────── */
.sc-root {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 0 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ══ TABLA DESKTOP ═══════════════════════════════════ */
.sc-table-wrap {
  background: $dark;
  border: 1px solid $border;
  border-radius: $rxl;
  overflow: hidden;
}

.sc-table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.4fr;
  padding: 14px 24px;
  background: rgba(255,107,53,.08);
  border-bottom: 1px solid rgba(255,107,53,.2);

  &__cell {
    font-size: .7rem;
    font-weight: 800;
    color: $orange;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.sc-table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.4fr;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid $border;
  position: relative;
  transition: background .2s;

  &:last-child { border-bottom: none; }
  &:hover { background: rgba(255,255,255,.02); }

  &--selected {
    background: rgba(255,107,53,.05);
    border-left: 3px solid $orange;
    padding-left: 21px;
  }

  &__sub {
    position: absolute;
    bottom: 4px; right: 24px;
    font-size: .72rem; color: $tm;
    strong { color: $orange; }
  }
}

.sc-table-cell { display: flex; align-items: center; }

/* ══ TABLA MOBILE ════════════════════════════════════ */
.sc-mobile-card {
  background: $card;
  border: 1px solid $border;
  border-radius: $rlg;
  padding: 16px 18px;
  position: relative;
  overflow: hidden;
  transition: border-color .2s, background .2s;

  &::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: var(--accent, $orange);
    opacity: 0; transition: opacity .2s;
  }

  &--selected {
    border-color: var(--accent) !important;
    background: $card2;
    &::before { opacity: 1; }
  }

  &__top {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 12px;
    margin-bottom: 14px;
  }

  &__info { display: flex; flex-direction: column; gap: 4px; }

  &__bottom {
    display: flex; align-items: center;
    justify-content: space-between;
  }

  &__sub {
    margin-top: 10px; font-size: .75rem; color: $tm;
    strong { color: var(--accent, $orange); }
  }
}

/* ── Shared elements ─────────────────────────────────── */
.plan-name-wrap {
  display: flex; align-items: center; gap: 10px;
}
.plan-dot {
  width: 8px; height: 8px;
  border-radius: 50%; flex-shrink: 0;
}
.plan-name {
  font-size: .9rem; font-weight: 700; color: $tp;
}

.entries-badge {
  display: inline-flex; align-items: center; gap: 4px;
  background: rgba(255,159,28,.1); border: 1px solid rgba(255,159,28,.25);
  color: $amber; font-size: .75rem; font-weight: 700;
  padding: 3px 10px; border-radius: 100px;
  &--sm { font-size: .7rem; padding: 2px 8px; }
  .q-icon { color: $amber; }
}

.price-badge {
  display: inline-flex; align-items: center;
  background: rgba(230,57,70,.12); border: 1px solid rgba(230,57,70,.3);
  color: $red; font-size: .88rem; font-weight: 900;
  padding: 4px 12px; border-radius: 100px;
  white-space: nowrap;
}

.qty-label { font-size: .75rem; color: $tm; font-weight: 600; }

/* ── Qty control ─────────────────────────────────────── */
.qty-ctrl {
  display: flex; align-items: center;
  background: rgba(255,255,255,.04);
  border: 1px solid $border;
  border-radius: 100px; overflow: hidden;
}

.qty-btn {
  width: 30px; height: 30px; border: none; background: none;
  color: $tm; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s, color .15s;
  &:hover:not(:disabled) { background: rgba(255,107,53,.15); color: $orange; }
  &:disabled { opacity: .3; cursor: not-allowed; }
  &--plus { color: $orange;
    &:hover:not(:disabled) { background: rgba(255,107,53,.2); } }
}

.qty-input {
  width: 44px; text-align: center; border: none; background: none;
  color: $tp; font-size: .88rem; font-weight: 800;
  outline: none;
  /* hide number arrows */
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
}

/* ══ CHECKOUT PANEL ══════════════════════════════════ */
.sc-checkout {
  background: $dark;
  border: 1px solid $border;
  border-radius: $rxl;
  padding: 28px 28px 24px;
}

/* Captcha */
.sc-captcha {
  &__label {
    display: flex; align-items: center; gap: 6px;
    font-size: .7rem; font-weight: 800; color: $tm;
    text-transform: uppercase; letter-spacing: 1px;
    margin-bottom: 16px;
    .q-icon { color: $orange; }
  }
  &__body {
    display: flex; align-items: flex-start;
    gap: 20px; flex-wrap: wrap;
  }
  &__widget { flex-shrink: 0; }
  &__input-wrap { flex: 1; min-width: 200px; }
  &__input {
    :deep(.q-field__control) {
      background: rgba(255,255,255,.04) !important;
      border-radius: 10px !important;
    }
    :deep(input) { color: $tp !important; font-weight: 600; }
    :deep(.q-field__label) { color: $tm !important; }
  }
}

.captcha-refresh-btn {
  width: 44px; height: 44px; border-radius: 10px;
  background: $orange; border: none;
  color: white; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s, transform .15s;
  &:hover { background: darken($orange, 8%); transform: rotate(20deg); }
}

.captcha-ok {
  display: flex; align-items: center; gap: 5px;
  font-size: .72rem; color: #4ade80;
  margin: 6px 0 0; font-weight: 600;
}

/* Divider */
.sc-checkout__divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,107,53,.3), transparent);
  margin: 24px 0;
}

/* Bottom */
.sc-checkout__bottom {
  display: flex; flex-direction: column; gap: 16px;
}

/* Total */
.sc-total {
  display: flex; align-items: center; justify-content: space-between;
  &__label { font-size: .85rem; font-weight: 700; color: $tm; }
  &__value {
    font-size: 1.5rem; font-weight: 900; color: $tm;
    transition: color .3s;
    &--active {
      color: $orange;
      text-shadow: 0 0 24px rgba(255,107,53,.4);
    }
  }
}

/* Buy button */
.sc-buy-btn {
  width: 100%; padding: 15px 24px;
  border-radius: 100px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  font-size: .95rem; font-weight: 800; letter-spacing: .5px;
  background: rgba(255,255,255,.06); color: $tm;
  transition: background .25s, color .25s, transform .2s, box-shadow .25s;

  &:disabled { cursor: not-allowed; opacity: .5; }

  &--active {
    background: linear-gradient(135deg, $orange 0%, $red 100%);
    color: white;
    box-shadow: 0 4px 24px rgba(230,57,70,.35);
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 36px rgba(255,107,53,.5);
    }
    &:active { transform: translateY(0); }
  }

  &__arrow { margin-left: auto; }
}

.sc-inactive-msg {
  display: flex; align-items: center; justify-content: center; gap: 5px;
  font-size: .75rem; color: $tm; margin: 0;
  .q-icon { color: $red; }
}

/* ══ RESPONSIVE ══════════════════════════════════════ */
@media (max-width: 640px) {
  .v1 { display: none !important; }
  .sc-checkout { padding: 20px 16px; }
}
@media (min-width: 641px) {
  .v2 { display: none !important; }
}

/* ── Captcha lib overrides ────────────────────────── */
@import url("/node_modules/vue-client-recaptcha/dist/style.css");

:deep(.captcha-box) {
  background: $card !important;
  border: 1px solid $border !important;
  border-radius: 10px !important;
  padding: 8px 14px !important;
}
:deep(.captcha-box canvas) {
  border-radius: 6px;
}

/* ── Transitions ─────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity .2s, transform .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
