<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import ProductComponent from './../../ecommerce/components/ProductComponent.vue'
import InformationComponent from './../../ecommerce/components/InformationComponent.vue'
import ProgressBarComponent from '../components/ProgressBarComponent.vue'
import { useEcommerceStore } from '../store/ecommerce-store'
import { getEventActive } from '../composables/useEcommerceComposable'

const $q = useQuasar()
const ecommerceStore = useEcommerceStore()

const stats = ref([
  { title: 'Clientes', icon: 'people', value: '200+', color: '#6C63FF' },
  { title: 'Seguidores', icon: 'favorite', value: '500+', color: '#FF6584' },
  { title: 'Reseñas', icon: 'star', value: '50+', color: '#43D9AD' },
  { title: 'Visitas', icon: 'visibility', value: '1,020+', color: '#FFB347' }
])

const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let countdownInterval: ReturnType<typeof setInterval> | null = null

function startCountdown(targetDate?: string) {
  const target = targetDate ? new Date(targetDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  countdownInterval = setInterval(() => {
    const now = Date.now()
    const diff = Math.max(0, target.getTime() - now)
    countdown.value = {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000)
    }
  }, 1000)
}

onMounted(() => {
  $q.loading.show({ message: 'Cargando evento...' })
  getEventActive()
    .then((response) => {
      ecommerceStore.activateEvent(response.data, response.data ? true : false)
      startCountdown(response.data?.date)
    })
    .catch(() => {
      $q.notify({ message: 'No hay eventos activos por el momento', type: 'warning', position: 'top', timeout: 4000 })
      ecommerceStore.isActive(false)
      startCountdown()
    })
    .finally(() => $q.loading.hide())
})
</script>

<template>
  <q-page-container class="raf-root">

    <!-- ═══════════════ HERO / NO EVENT ═══════════════ -->
    <section v-if="!ecommerceStore.isActiveEvente" class="hero-coming">
      <div class="hero-coming__glow" />
      <div class="hero-coming__content">
        <div class="hero-coming__badge">
          <q-icon name="celebration" size="18px" />
          <span>Próximamente</span>
        </div>
        <h1 class="hero-coming__title">Algo increíble<br /><em>está llegando</em></h1>
        <p class="hero-coming__sub">
          Pronto un nuevo evento de sorteos estará disponible.<br />
          Mantente atento y sé el primero en adquirir tus números.
        </p>
        <!-- Countdown -->
        <div class="countdown-row">
          <div v-for="(val, key) in countdown" :key="key" class="countdown-block">
            <span class="countdown-block__num">{{ String(val).padStart(2, '0') }}</span>
            <span class="countdown-block__label">{{ { days: 'Días', hours: 'Hrs', minutes: 'Min', seconds: 'Seg' }[key] }}</span>
          </div>
        </div>
        <!-- Notify -->
        <q-btn unelevated class="hero-coming__btn" label="Notifícame" icon="notifications_active" to="/notify" />
      </div>
      <div class="hero-coming__particles">
        <span v-for="n in 12" :key="n" class="particle" :style="`--i:${n}`" />
      </div>
    </section>

    <!-- ═══════════════ HERO / ACTIVE EVENT ═══════════════ -->
    <section v-if="ecommerceStore.isActiveEvente" class="hero-event">
      <div class="hero-event__backdrop">
        <q-img
          :src="ecommerceStore.activeEvent.img"
          class="hero-event__bg-img"
          fit="cover"
        />
        <div class="hero-event__overlay" />
      </div>
      <div class="hero-event__content">
        <div class="hero-event__badge">
          <span class="pulse-dot" />
          <span>Evento Activo</span>
        </div>
        <h1 class="hero-event__title">{{ ecommerceStore.activeEvent.name }}</h1>
        <p class="hero-event__sub">¡No dejes pasar esta oportunidad única! Elige tu número de la suerte.</p>

        <!-- Countdown inside hero -->
        <div class="countdown-row countdown-row--hero">
          <div v-for="(val, key) in countdown" :key="key" class="countdown-block countdown-block--light">
            <span class="countdown-block__num">{{ String(val).padStart(2, '0') }}</span>
            <span class="countdown-block__label">{{ { days: 'Días', hours: 'Hrs', minutes: 'Min', seconds: 'Seg' }[key] }}</span>
          </div>
        </div>

        <div class="hero-event__ctas">
          <q-btn unelevated class="cta-primary" size="lg" icon="confirmation_number" label="Comprar Ahora" to="/sales" />
          <q-btn outline class="cta-secondary" size="lg" icon="info" label="Ver Detalles" />
        </div>
      </div>
    </section>

    <!-- ═══════════════ PROGRESS BAR ═══════════════ -->
    <section class="section-progress">
      <div class="section-inner">
        <div class="section-label">
          <q-icon name="local_fire_department" color="orange" />
          <span>¡Las entradas se están agotando!</span>
        </div>
        <ProgressBarComponent />
      </div>
    </section>

    <!-- ═══════════════ PLANS BANNER ═══════════════ -->
    <section class="section-banner">
      <div class="section-inner section-inner--banner">
        <div class="banner-card">
          <q-icon name="shopping_cart" size="32px" class="banner-card__icon" />
          <div class="banner-card__text">
            <strong>¿Quieres comprar varios planes?</strong>
            <span>Aumenta tus chances de ganar adquiriendo más de un número.</span>
          </div>
          <q-btn unelevated class="cta-primary" label="Ver Todos los Planes" to="/sales" />
        </div>
      </div>
    </section>

    <!-- ═══════════════ PRODUCTS ═══════════════ -->
    <section class="section-products">
      <div class="section-inner">
        <div class="section-heading">
          <h2>Elige tu <em>plan favorito</em></h2>
          <p>Dispones de diferentes opciones con mayor probabilidad de ganar según cada paquete.</p>
        </div>
        <ProductComponent />
      </div>
    </section>

    <!-- ═══════════════ INFORMATION ═══════════════ -->
    <!-- <section class="section-info">
      <div class="section-inner">
        <InformationComponent />
      </div>
    </section> -->

    <!-- ═══════════════ STATS ═══════════════ -->
    <section class="section-stats">
      <div class="section-inner">
        <div class="section-heading section-heading--light">
          <h2>Nuestra <em>comunidad</em></h2>
          <p>Miles de personas ya confían en nosotros</p>
        </div>
        <div class="stats-grid">
          <div v-for="(item, i) in stats" :key="i" class="stat-card" :style="`--accent: ${item.color}`">
            <div class="stat-card__icon-wrap">
              <q-icon :name="item.icon" size="28px" :style="`color: ${item.color}`" />
            </div>
            <span class="stat-card__value">{{ item.value }}</span>
            <span class="stat-card__label">{{ item.title }}</span>
          </div>
        </div>
      </div>
    </section>

  </q-page-container>
</template>

<style lang="scss" scoped>
/* ─── Design Tokens ─────────────────────────────────── */
$bg-base: #08090e;
$bg-surface: #10121a;
$bg-card: #161924;
$border: rgba(255,255,255,0.07);
$gold: #FFD166;
$neon: #43D9AD;
$accent: #6C63FF;
$text-primary: #F0F0F8;
$text-muted: #8B8FA8;
$radius-lg: 20px;
$radius-md: 12px;

/* ─── Root ──────────────────────────────────────────── */
.raf-root {
  background: $bg-base;
  min-height: 100vh;
  font-family: 'Segoe UI', system-ui, sans-serif;
  padding-top: 0 !important;
}

/* ─── Coming Soon Hero ──────────────────────────────── */
.hero-coming {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,99,255,0.18) 0%, transparent 70%),
              radial-gradient(ellipse 60% 50% at 80% 100%, rgba(67,217,173,0.12) 0%, transparent 70%),
              $bg-base;

  &__glow {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  &__content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 48px 24px;
    max-width: 640px;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(108,99,255,0.15);
    border: 1px solid rgba(108,99,255,0.35);
    color: $accent;
    padding: 6px 16px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 28px;
  }

  &__title {
    font-size: clamp(2.2rem, 6vw, 3.8rem);
    font-weight: 800;
    color: $text-primary;
    line-height: 1.15;
    margin: 0 0 20px;
    em {
      font-style: normal;
      background: linear-gradient(135deg, $gold, $neon);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  &__sub {
    color: $text-muted;
    font-size: 1.05rem;
    line-height: 1.7;
    margin-bottom: 36px;
  }

  &__btn {
    background: linear-gradient(135deg, $accent, darken($accent, 10%)) !important;
    color: white !important;
    border-radius: 100px !important;
    padding: 12px 32px !important;
    font-weight: 700;
    margin-top: 28px;
    letter-spacing: 0.5px;
    transition: transform 0.2s, box-shadow 0.2s;
    &:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(108,99,255,0.4); }
  }

  &__particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
}

/* Floating particles */
.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: $gold;
  opacity: 0.4;
  left: calc(var(--i) * 8.33%);
  top: 100%;
  animation: float calc(6s + var(--i) * 0.5s) linear infinite;
  animation-delay: calc(var(--i) * -0.5s);
}
@keyframes float {
  0%   { top: 110%; opacity: 0; transform: translateX(0) scale(1); }
  20%  { opacity: 0.6; }
  80%  { opacity: 0.3; }
  100% { top: -10%; opacity: 0; transform: translateX(40px) scale(0.5); }
}

/* ─── Countdown ─────────────────────────────────────── */
.countdown-row {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 28px 0;

  &--hero { margin: 20px 0 32px; }
}
.countdown-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-md;
  padding: 12px 16px;
  min-width: 68px;

  &--light {
    background: rgba(0,0,0,0.45);
    border-color: rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
  }

  &__num {
    font-size: 1.75rem;
    font-weight: 800;
    color: $gold;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  &__label {
    font-size: 0.65rem;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 4px;
  }
}

/* ─── Active Event Hero ─────────────────────────────── */
.hero-event {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;

  &__backdrop {
    position: absolute;
    inset: 0;
    .hero-event__bg-img { width: 100%; height: 100%; }
    .hero-event__overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top,
        rgba(8,9,14,0.97) 0%,
        rgba(8,9,14,0.6) 50%,
        rgba(8,9,14,0.2) 100%
      );
    }
  }

  &__content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 64px 24px;
    text-align: center;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(67,217,173,0.12);
    border: 1px solid rgba(67,217,173,0.3);
    color: $neon;
    padding: 6px 16px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  &__title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 900;
    color: $text-primary;
    line-height: 1.1;
    margin: 0 0 16px;
    text-shadow: 0 4px 32px rgba(0,0,0,0.6);
  }

  &__sub {
    color: rgba(240,240,248,0.75);
    font-size: 1.05rem;
    margin-bottom: 8px;
  }

  &__ctas {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 8px;
  }
}

/* Live pulse dot */
.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $neon;
  box-shadow: 0 0 0 0 rgba(67,217,173,0.4);
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(67,217,173,0.5); }
  50% { box-shadow: 0 0 0 8px rgba(67,217,173,0); }
}

/* ─── CTA Buttons ───────────────────────────────────── */
.cta-primary {
  background: linear-gradient(135deg, $gold, darken($gold, 12%)) !important;
  color: #1a1200 !important;
  border-radius: 100px !important;
  font-weight: 800 !important;
  letter-spacing: 0.5px;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(255,209,102,0.35); }
}

.cta-secondary {
  border-color: rgba(255,255,255,0.25) !important;
  color: $text-primary !important;
  border-radius: 100px !important;
  backdrop-filter: blur(8px);
  background: rgba(255,255,255,0.06) !important;
  &:hover { border-color: rgba(255,255,255,0.5) !important; }
}

/* ─── Progress Section ──────────────────────────────── */
.section-progress {
  background: $bg-surface;
  border-top: 1px solid $border;
  border-bottom: 1px solid $border;
  padding: 24px 0;
}

.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  &--banner { padding: 40px 24px; }
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: $text-muted;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

/* ─── Banner ────────────────────────────────────────── */
.section-banner { background: $bg-base; }

.banner-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, rgba(108,99,255,0.12), rgba(67,217,173,0.08));
  border: 1px solid rgba(108,99,255,0.2);
  border-radius: $radius-lg;
  padding: 24px 28px;
  flex-wrap: wrap;

  &__icon { color: $accent; flex-shrink: 0; }

  &__text {
    flex: 1;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    strong { color: $text-primary; font-size: 1rem; }
    span { color: $text-muted; font-size: 0.875rem; }
  }
}

/* ─── Section Headings ──────────────────────────────── */
.section-heading {
  text-align: center;
  margin-bottom: 48px;

  h2 {
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 800;
    color: $text-primary;
    margin: 0 0 12px;
    em {
      font-style: normal;
      background: linear-gradient(135deg, $gold, $neon);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  p {
    color: $text-muted;
    font-size: 1rem;
    max-width: 480px;
    margin: 0 auto;
    line-height: 1.7;
  }

  &--light h2 { color: $text-primary; }
}

/* ─── Products & Info Sections ──────────────────────── */
.section-products {
  background: $bg-base;
  padding: 80px 0;
}

.section-info {
  background: $bg-surface;
  border-top: 1px solid $border;
  padding: 80px 0;
}

/* ─── Stats ─────────────────────────────────────────── */
.section-stats {
  background: $bg-base;
  padding: 80px 0;
  border-top: 1px solid $border;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 32px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.25s, border-color 0.25s;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--accent);
    border-radius: $radius-lg $radius-lg 0 0;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: var(--accent);
    box-shadow: 0 12px 40px rgba(0,0,0,0.3);
  }

  &__icon-wrap {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__value {
    font-size: 1.9rem;
    font-weight: 900;
    color: $text-primary;
    line-height: 1;
  }

  &__label {
    font-size: 0.8rem;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }
}

/* ─── Footer ────────────────────────────────────────── */
.raf-footer {
  background: $bg-surface;
  border-top: 1px solid $border;
  text-align: center;
  padding: 24px;
  font-size: 0.8rem;
  color: $text-muted;
}

/* ─── Responsive ────────────────────────────────────── */
@media (max-width: 600px) {
  .hero-event__ctas { flex-direction: column; align-items: center; }
  .banner-card { flex-direction: column; text-align: center; }
  .countdown-block { min-width: 56px; padding: 10px 12px; }
  .countdown-block__num { font-size: 1.4rem; }
}
</style>
