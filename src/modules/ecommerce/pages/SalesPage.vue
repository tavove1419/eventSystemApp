
<script setup lang="ts">
  import SalesComponent from './../../ecommerce/components/SalesComponent.vue'
</script>

<template>
  <q-page-container class="sales-root">

    <!-- Hero -->
    <section class="sales-hero">
      <div class="sales-hero__glow" />
      <div class="sales-hero__content">
        <div class="sales-hero__badge">
          <q-icon name="confirmation_number" size="16px" />
          <span>Portal de Compra</span>
        </div>
        <h1 class="sales-hero__title">Elige tus <em>números de la suerte</em></h1>
        <p class="sales-hero__sub">
          Selecciona el plan que más se adapte a ti y aumenta tus probabilidades de ganar.
        </p>
        <div class="trust-row">
          <div class="trust-item"><q-icon name="lock" size="15px" /><span>Compra segura</span></div>
          <div class="trust-item"><q-icon name="verified" size="15px" /><span>Evento verificado</span></div>
          <div class="trust-item"><q-icon name="support_agent" size="15px" /><span>Soporte 24/7</span></div>
        </div>
      </div>
    </section>

    <!-- Componente de ventas con datos reales -->
    <section class="sales-body">
      <SalesComponent />
    </section>

  </q-page-container>
</template>

<style lang="scss" scoped>
$bg:   #08090e;
$neon: #43D9AD;
$gold: #FFD166;
$tp:   #F0F0F8;
$tm:   #8B8FA8;

.sales-root {
  background: $bg;
  min-height: 100vh;
  padding-top: 0 !important;
}

.sales-hero {
  position: relative; overflow: hidden;
  padding: 72px 24px 52px; text-align: center;
  background: radial-gradient(ellipse 70% 60% at 50% 0%,
    rgba(108,99,255,.16) 0%, transparent 70%), $bg;

  &__glow {
    position: absolute; width: 600px; height: 300px;
    top: -80px; left: 50%; transform: translateX(-50%);
    background: radial-gradient(ellipse, rgba(108,99,255,.13) 0%, transparent 70%);
    pointer-events: none; border-radius: 50%;
  }
  &__content { position: relative; z-index: 1; max-width: 620px; margin: 0 auto; }
  &__badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(67,217,173,.1); border: 1px solid rgba(67,217,173,.3);
    color: $neon; padding: 5px 14px; border-radius: 100px;
    font-size: 12px; font-weight: 700; letter-spacing: .5px; margin-bottom: 18px;
  }
  &__title {
    font-size: clamp(1.7rem, 4.5vw, 2.8rem); font-weight: 900;
    color: $tp; line-height: 1.15; margin: 0 0 14px;
    em {
      font-style: normal;
      background: linear-gradient(135deg, $gold, $neon);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
  }
  &__sub { color: $tm; font-size: .95rem; line-height: 1.7; margin-bottom: 24px; }
}

.trust-row { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
.trust-item {
  display: flex; align-items: center; gap: 6px;
  font-size: .78rem; color: $tm; font-weight: 600;
  .q-icon { color: $neon; }
}

.sales-body { padding: 0 24px 80px; }
</style>
