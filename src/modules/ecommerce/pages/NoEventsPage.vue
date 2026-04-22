<script setup lang="ts">
// No event active state — shown as a full page, not a dialog
</script>

<template>
  <q-page-container class="no-event-root">
    <div class="no-event-wrap">

      <!-- Animated background orbs -->
      <div class="orb orb--1" />
      <div class="orb orb--2" />
      <div class="orb orb--3" />

      <div class="no-event-card">
        <!-- Icon -->
        <div class="no-event-card__icon-wrap">
          <q-icon name="event_upcoming" size="44px" class="no-event-card__icon" />
        </div>

        <!-- Heading -->
        <h1 class="no-event-card__title">
          Muy pronto un nuevo<br /><em>evento estará disponible</em>
        </h1>

        <p class="no-event-card__sub">
          Estamos preparando algo increíble para ti. Recuerda estar atento — pronto podrás adquirir tus números de la suerte.
        </p>

        <!-- Divider -->
        <div class="no-event-card__divider" />

        <!-- Features -->
        <div class="feature-list">
          <div class="feature-item">
            <q-icon name="notifications_active" size="20px" class="feature-item__icon" />
            <div>
              <strong>Activa las notificaciones</strong>
              <p>Sé el primero en enterarte cuando abra el nuevo sorteo.</p>
            </div>
          </div>
          <div class="feature-item">
            <q-icon name="share" size="20px" class="feature-item__icon" />
            <div>
              <strong>Comparte con tus amigos</strong>
              <p>Invita a tus amigos y participen juntos.</p>
            </div>
          </div>
          <div class="feature-item">
            <q-icon name="emoji_events" size="20px" class="feature-item__icon" />
            <div>
              <strong>Grandes premios te esperan</strong>
              <p>Cada evento trae premios más emocionantes.</p>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <q-btn unelevated class="no-event-card__btn" icon="notifications_active" label="Notifícame del próximo evento" />
      </div>
    </div>
  </q-page-container>
</template>

<style lang="scss" scoped>
$bg-base: #08090e;
$bg-card: #161924;
$border: rgba(255,255,255,0.07);
$gold: #FFD166;
$neon: #43D9AD;
$accent: #6C63FF;
$text-primary: #F0F0F8;
$text-muted: #8B8FA8;
$radius-lg: 24px;

.no-event-root {
  background: $bg-base;
  min-height: 100vh;
  padding-top: 0 !important;
}

.no-event-wrap {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  overflow: hidden;
}

/* Floating orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
  opacity: 0.25;

  &--1 {
    width: 400px; height: 400px;
    background: $accent;
    top: -10%; left: -10%;
    animation: drift 12s ease-in-out infinite alternate;
  }
  &--2 {
    width: 300px; height: 300px;
    background: $neon;
    bottom: -5%; right: -5%;
    animation: drift 9s ease-in-out infinite alternate-reverse;
  }
  &--3 {
    width: 200px; height: 200px;
    background: $gold;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    animation: drift 15s ease-in-out infinite alternate;
  }
}

@keyframes drift {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(40px, 30px); }
}

.no-event-card {
  position: relative;
  z-index: 2;
  max-width: 560px;
  width: 100%;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 48px 40px;
  text-align: center;
  box-shadow: 0 32px 80px rgba(0,0,0,0.4);

  &__icon-wrap {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(108,99,255,0.2), rgba(67,217,173,0.15));
    border: 1px solid rgba(108,99,255,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 28px;
  }

  &__icon { color: $neon; }

  &__title {
    font-size: clamp(1.4rem, 3.5vw, 2rem);
    font-weight: 900;
    color: $text-primary;
    line-height: 1.25;
    margin: 0 0 16px;
    em {
      font-style: normal;
      background: linear-gradient(135deg, $gold, $neon);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  &__sub {
    color: $text-muted;
    font-size: 0.95rem;
    line-height: 1.7;
    margin-bottom: 28px;
  }

  &__divider {
    height: 1px;
    background: $border;
    margin: 28px 0;
  }

  &__btn {
    background: linear-gradient(135deg, $accent, darken($accent, 10%)) !important;
    color: white !important;
    border-radius: 100px !important;
    padding: 12px 28px !important;
    font-weight: 700 !important;
    width: 100%;
    margin-top: 28px;
    transition: transform 0.2s, box-shadow 0.2s;
    &:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(108,99,255,0.4); }
  }
}

/* Feature list */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;

  &__icon { color: $gold; flex-shrink: 0; margin-top: 2px; }

  strong {
    display: block;
    color: $text-primary;
    font-size: 0.9rem;
    font-weight: 700;
    margin-bottom: 2px;
  }

  p {
    color: $text-muted;
    font-size: 0.82rem;
    line-height: 1.5;
    margin: 0;
  }
}

@media (max-width: 500px) {
  .no-event-card { padding: 32px 24px; }
}
</style>
