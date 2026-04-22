<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { assignedCounter } from '../composables/useProgressBarComposable';


  const progress = ref(0)
  const progressLabel = ref('')

  onMounted(() => {
    assignedCounter().then((response) => {
      progress.value = response.data / 1000
      progressLabel.value = (progress.value * 100).toFixed(1) + '%'
    })
  })
</script>

<template>
  <div class="pb-root">
    <div class="pb-wrap">

      <!-- Encabezado -->
      <div class="pb-header">
        <div class="pb-header__left">
          <div class="pb-header__fire">
            <q-icon name="local_fire_department" size="20px" />
          </div>
          <span class="pb-header__text">¡Adquiere tus entradas antes de que se agoten!</span>
        </div>
        <div class="pb-header__badge">
          <q-icon name="confirmation_number" size="13px" />
          <span>{{ progressLabel }} Vendidas</span>
        </div>
      </div>

      <!-- Barra de progreso -->
      <div class="pb-track">
        <!-- Relleno animado -->
        <div
          class="pb-fill"
          :style="`width: ${progress * 100}%`"
        >
          <div class="pb-fill__shine" />
        </div>

        <!-- Etiqueta sobre la barra -->
        <div class="pb-track__label">
          <q-icon name="sell" size="13px" />
          <span>{{ progressLabel }} Vendidas</span>
        </div>

        <!-- Indicador de urgencia si supera el 70% -->
        <div
          v-if="progress >= 0.7"
          class="pb-urgent"
          :style="`left: calc(${progress * 100}% - 8px)`"
        >
          <q-icon name="warning" size="14px" />
        </div>
      </div>

      <!-- Leyenda inferior -->
      <div class="pb-footer">
        <span class="pb-footer__item">
          <span class="pb-footer__dot pb-footer__dot--sold" />
          Vendidas
        </span>
        <span class="pb-footer__urgency" v-if="progress >= 0.7">
          <q-icon name="bolt" size="13px" /> ¡Pocas entradas disponibles!
        </span>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
$black:  #09090c;
$dark:   #111318;
$border: rgba(255,255,255,.07);
$orange: #FF6B35;
$red:    #E63946;
$amber:  #FF9F1C;
$tp:     #F2F2F5;
$tm:     #888A99;

.pb-root {
  width: 100%;
  padding: 0 4px;
}

.pb-wrap {
  background: $dark;
  border: 1px solid rgba(255,107,53,.2);
  border-radius: 18px;
  padding: 20px 24px;
  position: relative;
  overflow: hidden;

  /* glow edge */
  &::before {
    content: '';
    position: absolute; inset: 0;
    border-radius: 18px;
    box-shadow: inset 0 0 40px rgba(255,107,53,.06);
    pointer-events: none;
  }
}

/* Header */
.pb-header {
  display: flex; align-items: center;
  justify-content: space-between; flex-wrap: wrap;
  gap: 10px; margin-bottom: 16px;

  &__left {
    display: flex; align-items: center; gap: 10px;
  }

  &__fire {
    width: 34px; height: 34px; border-radius: 10px;
    background: rgba(255,107,53,.15);
    border: 1px solid rgba(255,107,53,.3);
    display: flex; align-items: center; justify-content: center;
    color: $orange;
    animation: pulse-fire 2s ease-in-out infinite;
  }

  &__text {
    font-size: .9rem; font-weight: 800;
    color: $tp; letter-spacing: .2px;
  }

  &__badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(230,57,70,.12);
    border: 1px solid rgba(230,57,70,.3);
    color: $red; font-size: .75rem; font-weight: 800;
    padding: 5px 12px; border-radius: 100px;
    letter-spacing: .3px;
  }
}

@keyframes pulse-fire {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,107,53,.4); }
  50%       { box-shadow: 0 0 0 6px rgba(255,107,53,0); }
}

/* Track */
.pb-track {
  position: relative;
  height: 44px;
  background: rgba(255,255,255,.05);
  border: 1px solid $border;
  border-radius: 100px;
  overflow: hidden;
}

/* Fill */
.pb-fill {
  position: absolute; left: 0; top: 0; bottom: 0;
  background: linear-gradient(90deg, $red 0%, $orange 60%, $amber 100%);
  border-radius: 100px;
  transition: width 1.2s cubic-bezier(.4, 0, .2, 1);
  min-width: 2%;

  &__shine {
    position: absolute; inset: 0;
    background: linear-gradient(
      180deg,
      rgba(255,255,255,.18) 0%,
      transparent 60%
    );
    border-radius: 100px;
  }
}

/* Label over bar */
.pb-track__label {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  gap: 6px;
  font-size: .82rem; font-weight: 800;
  color: white;
  text-shadow: 0 1px 4px rgba(0,0,0,.6);
  pointer-events: none;
  z-index: 2;
}

/* Urgency marker */
.pb-urgent {
  position: absolute; top: -4px;
  color: $amber;
  z-index: 3;
  animation: bounce 0.8s ease-in-out infinite alternate;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to   { transform: translateY(4px); }
}

/* Footer */
.pb-footer {
  display: flex; align-items: center;
  gap: 16px; margin-top: 12px; flex-wrap: wrap;

  &__item {
    display: flex; align-items: center; gap: 6px;
    font-size: .72rem; color: $tm; font-weight: 600;
  }

  &__dot {
    width: 8px; height: 8px; border-radius: 50%;
    &--sold  { background: $orange; }
    &--avail { background: rgba(255,255,255,.15); border: 1px solid $border; }
  }

  &__urgency {
    margin-left: auto;
    display: flex; align-items: center; gap: 4px;
    font-size: .72rem; font-weight: 800; color: $amber;
    animation: flicker 1.5s ease-in-out infinite;
  }
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50%       { opacity: .5; }
}
</style>
