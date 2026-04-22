<script setup lang="ts">
  import { ref } from 'vue'

  const slide = ref<number>(1)
</script>

<template>
  <div class="ic-root">

    <!-- Encabezado de sección -->
    <div class="ic-heading">
      <div class="ic-heading__badge">
        <q-icon name="emoji_events" size="14px" />
        <span>Premios del Sorteo</span>
      </div>
      <h2 class="ic-heading__title">Lo que puedes <em>ganar</em></h2>
      <p class="ic-heading__sub">Conoce los increíbles premios que están esperando por ti</p>
    </div>

    <!-- Carousel -->
    <div class="ic-carousel-wrap">
      <!-- Indicadores de slide -->
      <div class="ic-dots">
        <button
          v-for="n in 3"
          :key="n"
          class="ic-dot"
          :class="{ 'ic-dot--active': slide === n }"
          @click="slide = n"
        />
      </div>

      <q-carousel
        animated
        v-model="slide"
        infinite
        arrows
        transition-prev="slide-right"
        transition-next="slide-left"
        class="ic-carousel"
      >
        <!-- Slide 1 — Moto -->
        <q-carousel-slide :name="1" class="ic-slide q-pa-none">
          <div class="ic-slide__inner">
            <div class="ic-slide__img-wrap">
              <q-img src="../../../assets/moto.jpg" fit="cover" class="ic-slide__img" />
              <div class="ic-slide__img-overlay" />
            </div>
            <div class="ic-slide__info">
              <div class="ic-slide__tag">
                <q-icon name="star" size="12px" /> Premio Principal
              </div>
              <h3 class="ic-slide__title">Yamaha YZF-R6</h3>
              <p class="ic-slide__desc">
                Una moto de alto rendimiento lista para la pista. Potencia, estilo y adrenalina pura.
              </p>
              <div class="ic-slide__cta">
                <q-icon name="confirmation_number" size="14px" />
                <span>Compra tu número y participa</span>
              </div>
            </div>
          </div>
        </q-carousel-slide>

        <!-- Slide 2 — PC -->
        <q-carousel-slide :name="2" class="ic-slide q-pa-none">
          <div class="ic-slide__inner">
            <div class="ic-slide__img-wrap">
              <q-img src="../../../assets/pc.png" fit="cover" class="ic-slide__img" />
              <div class="ic-slide__img-overlay ic-slide__img-overlay--red" />
            </div>
            <div class="ic-slide__info">
              <div class="ic-slide__tag ic-slide__tag--red">
                <q-icon name="computer" size="12px" /> 2do Premio
              </div>
              <h3 class="ic-slide__title">PC Gamer de Alta Gama</h3>
              <p class="ic-slide__desc">
                Equipo de última generación con las mejores especificaciones para gaming y trabajo.
              </p>
              <div class="ic-slide__cta">
                <q-icon name="confirmation_number" size="14px" />
                <span>Compra tu número y participa</span>
              </div>
            </div>
          </div>
        </q-carousel-slide>

        <!-- Slide 3 — Dinero -->
        <q-carousel-slide :name="3" class="ic-slide q-pa-none">
          <div class="ic-slide__inner">
            <div class="ic-slide__img-wrap">
              <q-img src="../../../assets/dinero.png" fit="cover" class="ic-slide__img" />
              <div class="ic-slide__img-overlay ic-slide__img-overlay--amber" />
            </div>
            <div class="ic-slide__info">
              <div class="ic-slide__tag ic-slide__tag--amber">
                <q-icon name="payments" size="12px" /> 3er Premio
              </div>
              <h3 class="ic-slide__title">Premio en Efectivo</h3>
              <p class="ic-slide__desc">
                Dinero en efectivo directo a tu cuenta. Úsalo como quieras, sin restricciones.
              </p>
              <div class="ic-slide__cta">
                <q-icon name="confirmation_number" size="14px" />
                <span>Compra tu número y participa</span>
              </div>
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>

  </div>
</template>

<style scoped lang="scss">
$black:  #09090c;
$dark:   #111318;
$card:   #16181f;
$border: rgba(255,255,255,.07);
$orange: #FF6B35;
$red:    #E63946;
$amber:  #FF9F1C;
$tp:     #F2F2F5;
$tm:     #888A99;

.ic-root {
  width: 100%;
}

/* Heading */
.ic-heading {
  text-align: center;
  margin-bottom: 32px;

  &__badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,107,53,.1);
    border: 1px solid rgba(255,107,53,.3);
    color: $orange; font-size: 12px; font-weight: 700;
    padding: 5px 14px; border-radius: 100px;
    letter-spacing: .5px; margin-bottom: 14px;
  }

  &__title {
    font-size: clamp(1.5rem, 3.5vw, 2.2rem);
    font-weight: 900; color: $tp; margin: 0 0 10px;
    em {
      font-style: normal;
      background: linear-gradient(135deg, $orange, $red);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  &__sub {
    color: $tm; font-size: .9rem; line-height: 1.6; margin: 0;
  }
}

/* Dots */
.ic-dots {
  display: flex; justify-content: center; gap: 8px;
  margin-bottom: 16px;
}
.ic-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(255,255,255,.15); border: none; cursor: pointer;
  transition: background .2s, transform .2s;
  &--active {
    background: $orange;
    transform: scale(1.3);
    box-shadow: 0 0 8px rgba(255,107,53,.5);
  }
}

/* Carousel */
.ic-carousel-wrap { position: relative; }

.ic-carousel {
  border-radius: 20px;
  overflow: hidden;
  background: $card !important;
  border: 1px solid $border;
  height: 420px !important;

  /* Override arrow buttons */
  :deep(.q-carousel__prev-btn),
  :deep(.q-carousel__next-btn) {
    background: rgba(255,107,53,.15) !important;
    border: 1px solid rgba(255,107,53,.3) !important;
    color: $orange !important;
    border-radius: 50% !important;
    &:hover {
      background: rgba(255,107,53,.3) !important;
    }
  }
}

.ic-slide {
  height: 100%;
  &__inner {
    display: flex;
    height: 100%;
    @media (max-width: 600px) { flex-direction: column; }
  }

  /* Image half */
  &__img-wrap {
    position: relative;
    flex: 1; min-width: 0;
    overflow: hidden;
  }
  &__img {
    width: 100%; height: 100%;
  }
  &__img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      90deg,
      transparent 40%,
      rgba(22,24,31,.95) 100%
    );
    /* Tint variants */
    &--red   { background: linear-gradient(90deg, transparent 40%, rgba(22,24,31,.95) 100%); }
    &--amber { background: linear-gradient(90deg, transparent 40%, rgba(22,24,31,.95) 100%); }

    @media (max-width: 600px) {
      background: linear-gradient(
        0deg,
        rgba(22,24,31,.97) 40%,
        transparent 100%
      ) !important;
    }
  }

  /* Info panel */
  &__info {
    width: 260px; flex-shrink: 0;
    display: flex; flex-direction: column; justify-content: center;
    padding: 28px 28px 28px 20px;
    background: $card;

    @media (max-width: 600px) {
      width: 100%;
      padding: 20px;
    }
  }

  &__tag {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(255,107,53,.12);
    border: 1px solid rgba(255,107,53,.3);
    color: $orange; font-size: 11px; font-weight: 700;
    padding: 3px 10px; border-radius: 100px;
    margin-bottom: 12px; width: fit-content;

    &--red   { background: rgba(230,57,70,.12); border-color: rgba(230,57,70,.3); color: $red; }
    &--amber { background: rgba(255,159,28,.12); border-color: rgba(255,159,28,.3); color: $amber; }
  }

  &__title {
    font-size: 1.15rem; font-weight: 900;
    color: $tp; line-height: 1.2; margin: 0 0 10px;
  }

  &__desc {
    font-size: .8rem; color: $tm;
    line-height: 1.6; margin: 0 0 18px;
  }

  &__cta {
    display: flex; align-items: center; gap: 6px;
    font-size: .75rem; font-weight: 700; color: $orange;
    padding: 8px 14px;
    background: rgba(255,107,53,.1);
    border: 1px solid rgba(255,107,53,.2);
    border-radius: 100px;
    width: fit-content;
  }
}
</style>
