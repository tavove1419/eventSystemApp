<script setup lang="ts">
  import { ref } from 'vue'
  import { useQuasar } from 'quasar'
  import { authentication } from '../composable/useAuthenticationComposable'
  import { useAuthenticationStore } from '../stores/authentication-store';
  import { useRouter } from 'vue-router';

  const router = useRouter()
  const $q = useQuasar()
  const isPwd = ref(true)
  const store = useAuthenticationStore()
  const loginForm = ref( {
    email: <string | null>null,
    password: <string | null>null,
  })

  function onLogin(): void {
    $q.loading.show({
      message: 'Validando autenticación...'
    })
    const credentials = {
      email: loginForm.value.email as string,
      password: loginForm.value.password as string
    }
    authentication(credentials).then(({data}) => {
      store.successLogin(data),
      router.push({path: '/dashboard'})
    })
    .catch((er) => {
      $q.notify({
        type: 'negative',
        message: er.message || 'Ha ocurrido en error al iniciar sesión',
        position: 'top',
        iconColor: 'white',
        html: true
      })
    })
    .finally(() => $q.loading.hide())
  }
</script>

<template>
  <div class="lc-root">

    <!-- Orbs de fondo -->
    <div class="lc-orb lc-orb--1" />
    <div class="lc-orb lc-orb--2" />

    <!-- Card central -->
    <div class="lc-card">

      <!-- Logo / Header -->
      <div class="lc-card__header">
        <div class="lc-card__logo">
          <q-icon name="emoji_events" size="28px" />
        </div>
        <h1 class="lc-card__title">Bienvenido de nuevo</h1>
        <p class="lc-card__sub">Ingresa tus credenciales para acceder al panel</p>
      </div>

      <!-- Formulario -->
      <q-form class="lc-form" @submit.prevent="onLogin()">

        <!-- Email -->
        <div class="lc-field">
          <label class="lc-label">
            <q-icon name="alternate_email" size="14px" /> Usuario / Correo
          </label>
          <q-input
            dark outlined dense
            color="orange"
            v-model="loginForm.email"
            placeholder="tu@correo.com"
            lazy-rules
            :rules="[(val: []) => val && val.length > 0 || 'El usuario es obligatorio']"
            class="lc-input"
          >
            <template #prepend>
              <q-icon name="person" size="18px" color="orange" />
            </template>
          </q-input>
        </div>

        <!-- Contraseña -->
        <div class="lc-field">
          <label class="lc-label">
            <q-icon name="lock" size="14px" /> Contraseña
          </label>
          <q-input
            dark outlined dense
            color="orange"
            :type="isPwd ? 'password' : 'text'"
            v-model="loginForm.password"
            placeholder="••••••••"
            lazy-rules
            :rules="[(val: []) => val && val.length > 0 || 'La contraseña es obligatoria']"
            class="lc-input"
          >
            <template #prepend>
              <q-icon name="lock_outline" size="18px" color="orange" />
            </template>
            <template #append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                size="18px"
                class="lc-eye"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>

        <!-- Acciones -->
        <div class="lc-actions">
          <button class="lc-btn lc-btn--primary" type="submit">
            <q-icon name="login" size="18px" />
            <span>Iniciar Sesión</span>
          </button>

          <router-link to="/" class="lc-btn lc-btn--ghost">
            <q-icon name="arrow_back" size="16px" />
            <span>Cancelar</span>
          </router-link>
        </div>

      </q-form>

      <!-- Footer card -->
      <div class="lc-card__footer">
        <q-icon name="lock" size="12px" />
        <span>Acceso restringido · Solo administradores</span>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
$black:  #09090c;
$dark:   #111318;
$card:   #16181f;
$border: rgba(255,255,255,.08);
$bdr2:   rgba(255,255,255,.14);
$orange: #FF6B35;
$red:    #E63946;
$amber:  #FF9F1C;
$tp:     #F2F2F5;
$tm:     #888A99;

/* ── Root ────────────────────────────────────────────── */
.lc-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse 70% 50% at 20% 20%, rgba(255,107,53,.1) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 80%, rgba(230,57,70,.08) 0%, transparent 60%),
    $black;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

/* Floating orbs */
.lc-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;

  &--1 {
    width: 380px; height: 380px;
    background: rgba(255,107,53,.12);
    top: -100px; left: -100px;
    animation: drift 14s ease-in-out infinite alternate;
  }
  &--2 {
    width: 280px; height: 280px;
    background: rgba(230,57,70,.1);
    bottom: -80px; right: -80px;
    animation: drift 10s ease-in-out infinite alternate-reverse;
  }
}
@keyframes drift {
  from { transform: translate(0, 0); }
  to   { transform: translate(30px, 20px); }
}

/* ── Card ────────────────────────────────────────────── */
.lc-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  background: $card;
  border: 1.5px solid $border;
  border-radius: 24px;
  padding: 40px 36px 28px;
  box-shadow: 0 32px 80px rgba(0,0,0,.5);

  /* Top gradient bar */
  &::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, $orange, $red);
    border-radius: 24px 24px 0 0;
  }

  &__header {
    text-align: center;
    margin-bottom: 32px;
  }

  &__logo {
    width: 60px; height: 60px;
    border-radius: 18px;
    background: linear-gradient(135deg, rgba(255,107,53,.2), rgba(230,57,70,.15));
    border: 1.5px solid rgba(255,107,53,.3);
    display: flex; align-items: center; justify-content: center;
    color: $orange;
    margin: 0 auto 18px;
    box-shadow: 0 0 30px rgba(255,107,53,.2);
  }

  &__title {
    font-size: 1.35rem; font-weight: 900;
    color: $tp; margin: 0 0 8px;
    letter-spacing: -.3px;
  }

  &__sub {
    font-size: .82rem; color: $tm;
    margin: 0; line-height: 1.5;
  }

  &__footer {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    margin-top: 24px; padding-top: 18px;
    border-top: 1px solid $border;
    font-size: .7rem; color: $tm;
    .q-icon { color: $orange; opacity: .6; }
  }
}

/* ── Form ────────────────────────────────────────────── */
.lc-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.lc-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.lc-label {
  display: flex; align-items: center; gap: 5px;
  font-size: .72rem; font-weight: 700; color: $tm;
  text-transform: uppercase; letter-spacing: .8px;
  .q-icon { color: $orange; }
}

.lc-input {
  :deep(.q-field__control) {
    background: rgba(255,255,255,.04) !important;
    border-radius: 12px !important;
    transition: box-shadow .2s;
  }
  :deep(.q-field--focused .q-field__control) {
    box-shadow: 0 0 0 2px rgba(255,107,53,.3) !important;
  }
  :deep(input) {
    color: $tp !important;
    font-weight: 500;
    font-size: .92rem;
    &::placeholder { color: rgba(255,255,255,.2) !important; }
  }
  :deep(.q-field__bottom) {
    color: $red !important;
    font-size: .72rem;
  }
}

.lc-eye {
  color: $tm !important;
  cursor: pointer;
  transition: color .15s;
  &:hover { color: $orange !important; }
}

/* ── Buttons ─────────────────────────────────────────── */
.lc-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}

.lc-btn {
  width: 100%; padding: 13px 20px;
  border-radius: 100px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 9px;
  font-size: .92rem; font-weight: 800; letter-spacing: .3px;
  text-decoration: none;
  transition: background .2s, transform .15s, box-shadow .2s;

  &--primary {
    background: linear-gradient(135deg, $orange 0%, $red 100%);
    color: white;
    box-shadow: 0 4px 24px rgba(255,107,53,.3);
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 36px rgba(255,107,53,.5);
    }
    &:active { transform: translateY(0); }
  }

  &--ghost {
    background: rgba(255,255,255,.05);
    color: $tm;
    border: 1px solid $border;
    &:hover {
      background: rgba(255,255,255,.09);
      color: $tp;
      border-color: $bdr2;
    }
  }
}
</style>
