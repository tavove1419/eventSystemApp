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
  <div class="prc-grid">
    <div
      v-for="({ title, price, text, icon }, index) in pricing_data"
      :key="title"
      class="prc-card"
      :class="{ 'prc-card--featured': index === 1 }"
      :style="`--idx: ${index}`"
    >
      <!-- Glow top accent -->
      <div class="prc-card__glow" />

      <!-- Badge popular -->
      <div v-if="index === 1" class="prc-card__popular">
        <q-icon name="star" size="11px" /> Más popular
      </div>

      <!-- Icon -->
      <div class="prc-card__icon-wrap">
        <q-icon
          :name="icon || 'shopping_cart_checkout'"
          size="26px"
          class="prc-card__icon"
        />
      </div>

      <!-- Title -->
      <h3 class="prc-card__title">{{ title }}</h3>

      <!-- Description -->
      <p class="prc-card__text">{{ text }}</p>

      <!-- Divider -->
      <div class="prc-card__divider" />

      <!-- Price -->
      <div class="prc-card__price-wrap">
        <span class="prc-card__price">{{ price }}</span>
        <span class="prc-card__currency">pesos</span>
      </div>

      <!-- Footer note -->
      <p class="prc-card__note">
        <q-icon name="info" size="12px" />
        Aplica términos y condiciones
      </p>

      <!-- CTA -->
      <router-link to="/sales" class="prc-card__btn">
        <q-icon name="confirmation_number" size="16px" />
        <span>Comprar Ahora</span>
        <q-icon name="arrow_forward" size="15px" style="margin-left:auto" />
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
$black:  #09090c;
$dark:   #111318;
$card:   #16181f;
$card2:  #1e1f28;
$border: rgba(255,255,255,.07);
$bdr2:   rgba(255,255,255,.13);
$orange: #FF6B35;
$red:    #E63946;
$amber:  #FF9F1C;
$tp:     #F2F2F5;
$tm:     #888A99;
$rxl:    20px;

/* Paleta por índice */
$accents: ($orange, $red, $amber, #a78bfa);

.prc-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  width: 100%;

  .prc-card {
    width: 240px;
    flex-shrink: 0;
    flex-grow: 0;
  }

  @media (max-width: 560px) {
    .prc-card { width: 100%; }
  }
}

.prc-card {
  position: relative;
  background: $card;
  border: 1.5px solid $border;
  border-radius: $rxl;
  padding: 28px 22px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
  transition: transform .25s, border-color .25s, box-shadow .25s;

  /* Accent color driven by --idx */
  --accent: #{$orange};

  @for $i from 0 through 3 {
    &:nth-child(#{$i + 1}) {
      --accent: #{nth($accents, $i + 1)};
    }
  }

  &:hover {
    transform: translateY(-5px);
    border-color: var(--accent);
    box-shadow: 0 12px 40px rgba(0,0,0,.35), 0 0 0 1px var(--accent);
  }

  /* Featured (middle) card */
  &--featured {
    background: $card2;
    border-color: rgba(230,57,70,.35);
    box-shadow: 0 8px 40px rgba(230,57,70,.15);
    transform: translateY(-6px);

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 16px 48px rgba(230,57,70,.25), 0 0 0 1px $red;
    }
  }

  /* Top color bar */
  &::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--accent);
    border-radius: $rxl $rxl 0 0;
  }

  &__glow {
    position: absolute;
    top: -60px; left: 50%;
    transform: translateX(-50%);
    width: 120px; height: 120px; border-radius: 50%;
    background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
    opacity: .1;
    pointer-events: none;
  }

  &__popular {
    position: absolute; top: 14px; right: 14px;
    display: inline-flex; align-items: center; gap: 4px;
    background: rgba(230,57,70,.12);
    border: 1px solid rgba(230,57,70,.3);
    color: $red; font-size: 10px; font-weight: 800;
    padding: 3px 9px; border-radius: 100px; letter-spacing: .4px;
  }

  &__icon-wrap {
    width: 56px; height: 56px; border-radius: 16px;
    background: rgba(255,255,255,.05);
    border: 1px solid var(--accent);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
    box-shadow: 0 0 20px rgba(0,0,0,.2);
  }

  &__icon { color: var(--accent); }

  &__title {
    font-size: 1rem; font-weight: 900;
    color: $tp; margin: 0 0 10px;
    text-transform: uppercase; letter-spacing: .5px;
  }

  &__text {
    font-size: .8rem; color: $tm; line-height: 1.6;
    margin: 0 0 16px; flex: 1;
  }

  &__divider {
    width: 40px; height: 2px;
    background: var(--accent);
    border-radius: 2px; margin-bottom: 16px;
    opacity: .5;
  }

  &__price-wrap {
    display: flex; align-items: baseline; gap: 4px;
    margin-bottom: 6px;
  }

  &__price {
    font-size: 1.6rem; font-weight: 900;
    color: var(--accent);
    text-shadow: 0 0 20px color-mix(in srgb, var(--accent) 40%, transparent);
  }

  &__currency {
    font-size: .75rem; color: $tm; font-weight: 600;
  }

  &__note {
    display: flex; align-items: center; justify-content: center; gap: 4px;
    font-size: .7rem; color: $tm; margin: 0 0 18px;
    .q-icon { color: $tm; }
  }

  &__btn {
    width: 100%; padding: 11px 16px;
    border-radius: 100px;
    background: rgba(255,255,255,.06);
    border: 1px solid $border;
    color: $tp; font-size: .82rem; font-weight: 800;
    text-decoration: none;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background .2s, border-color .2s, transform .15s, box-shadow .2s;

    &:hover {
      background: var(--accent);
      border-color: var(--accent);
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px color-mix(in srgb, var(--accent) 40%, transparent);
    }
  }
}
</style>
