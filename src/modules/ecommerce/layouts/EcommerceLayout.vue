<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { useEcommerceStore } from '../store/ecommerce-store'

const year = ref<number>(0)
const scrolled = ref<boolean>(false)
const drawerOpen = ref<boolean>(false)
// const ecommerceStore = useEcommerceStore()

onMounted(() => {
  year.value = new Date().getFullYear()
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 40
  }, { passive: true })
})

const navLinks = [
  { label: 'Inicio', icon: 'home', to: '/' },
  { label: 'Login', icon: 'verified_user', to: '/login' },
  // { label: 'Comprar', icon: 'shopping_cart', to: '/sales' },
]
</script>

<template>
  <q-layout view="hHh lpR fFf" class="raf-layout">

    <!-- ═══════════ NAVBAR ═══════════ -->
    <q-header :class="['raf-header', { 'raf-header--scrolled': scrolled }]">
      <q-toolbar class="raf-toolbar">

        <!-- Logo -->
        <q-toolbar-title class="raf-logo" shrink>
          <router-link to="/" class="raf-logo__link">
            <div class="raf-logo__icon">
              <q-icon name="emoji_events" size="20px" />
            </div>
            <span class="raf-logo__text"><em>La Ruleta</em></span>
          </router-link>
        </q-toolbar-title>

        <q-space />

        <!-- Desktop nav -->
        <nav class="raf-nav gt-xs">
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="raf-nav__link"
            active-class="raf-nav__link--active"
          >
            <q-icon :name="link.icon" size="16px" />
            <span>{{ link.label }}</span>
          </router-link>
        </nav>

        <!-- Mobile menu button -->
        <q-btn
          flat dense round
          icon="menu"
          class="xs raf-menu-btn"
          @click="drawerOpen = !drawerOpen"
        />

      </q-toolbar>
    </q-header>

    <!-- ═══════════ MOBILE DRAWER ═══════════ -->
    <q-drawer
      v-model="drawerOpen"
      side="right"
      overlay
      :width="240"
      class="raf-drawer"
    >
      <div class="raf-drawer__header">
        <div class="raf-logo__icon raf-logo__icon--sm">
          <q-icon name="emoji_events" size="16px" />
        </div>
        <span class="raf-logo__text" style="font-size:1rem">NimetSoft<em>Events</em></span>
        <q-space />
        <q-btn flat dense round icon="close" class="raf-menu-btn" @click="drawerOpen = false" />
      </div>
      <q-separator class="raf-drawer__sep" />
      <nav class="raf-drawer__nav">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="raf-drawer__link"
          active-class="raf-drawer__link--active"
          @click="drawerOpen = false"
        >
          <q-icon :name="link.icon" size="18px" />
          <span>{{ link.label }}</span>
        </router-link>
      </nav>
    </q-drawer>

    <!-- ═══════════ PAGE ═══════════ -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- ═══════════ FOOTER ═══════════ -->
    <footer class="raf-footer">
      <div class="raf-footer__inner">
        <div class="raf-footer__brand">
          <div class="raf-logo__icon raf-logo__icon--sm">
            <q-icon name="emoji_events" size="14px" />
          </div>
          <span class="raf-logo__text" style="font-size:0.85rem"><em>La Ruleta</em></span>
        </div>

        <span class="raf-footer__copy">
          © {{ year }} La Ruleta · Todos los derechos reservados
        </span>

        <div class="raf-footer__socials">
          <a href="#" class="raf-footer__social-btn" aria-label="Instagram">
            <q-icon name="fab fa-instagram" size="16px" />
          </a>
          <a href="#" class="raf-footer__social-btn" aria-label="Facebook">
            <q-icon name="fab fa-facebook" size="16px" />
          </a>
          <a href="#" class="raf-footer__social-btn" aria-label="WhatsApp">
            <q-icon name="fab fa-whatsapp" size="16px" />
          </a>
        </div>
      </div>
    </footer>

  </q-layout>
</template>

<style scoped lang="scss">
/* ─── Tokens ─────────────────────────────────────────── */
$bg-base: #08090e;
$bg-glass: rgba(8, 9, 14, 0.75);
$border: rgba(255, 255, 255, 0.08);
$gold: #FFD166;
$neon: #43D9AD;
$accent: #6C63FF;
$text-primary: #F0F0F8;
$text-muted: #8B8FA8;

/* ─── Layout Root ────────────────────────────────────── */
.raf-layout {
  background: $bg-base !important;
  min-height: 100vh;
}

/* ─── Header ─────────────────────────────────────────── */
.raf-header {
  background: transparent !important;
  transition: background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease;
  border-bottom: 1px solid transparent;

  &--scrolled {
    background: $bg-glass !important;
    backdrop-filter: blur(16px) saturate(1.4);
    -webkit-backdrop-filter: blur(16px) saturate(1.4);
    border-bottom-color: $border !important;
    box-shadow: 0 4px 32px rgba(0,0,0,0.3);
  }
}

.raf-toolbar {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 12px 24px;
  min-height: 60px !important;
}

/* ─── Logo ───────────────────────────────────────────── */
.raf-logo {
  &__link {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  &__icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, $accent, $neon);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;

    &--sm {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: linear-gradient(135deg, $accent, $neon);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }
  }

  &__text {
    font-size: 1.1rem;
    font-weight: 800;
    color: $text-primary;
    letter-spacing: -0.3px;
    em {
      font-style: normal;
      background: linear-gradient(135deg, $gold, $neon);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}

/* ─── Desktop Nav ────────────────────────────────────── */
.raf-nav {
  display: flex;
  align-items: center;
  gap: 4px;

  &__link {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 100px;
    text-decoration: none;
    color: $text-muted;
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.2px;
    transition: color 0.2s, background 0.2s;

    .q-icon { transition: color 0.2s; }

    &:hover {
      color: $text-primary;
      background: rgba(255,255,255,0.06);
    }

    &--active {
      color: $gold !important;
      background: rgba(255,209,102,0.1) !important;
      .q-icon { color: $gold !important; }
    }
  }
}

.raf-menu-btn {
  color: $text-muted !important;
  &:hover { color: $text-primary !important; }
}

/* ─── Mobile Drawer ──────────────────────────────────── */
.raf-drawer {
  background: #0e1018 !important;
  border-left: 1px solid $border !important;

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 20px;
  }

  &__sep {
    background: $border !important;
    margin: 0 !important;
  }

  &__nav {
    display: flex;
    flex-direction: column;
    padding: 12px 12px;
    gap: 4px;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    text-decoration: none;
    color: $text-muted;
    font-size: 0.9rem;
    font-weight: 600;
    transition: color 0.2s, background 0.2s;

    &:hover {
      color: $text-primary;
      background: rgba(255,255,255,0.06);
    }

    &--active {
      color: $gold !important;
      background: rgba(255,209,102,0.1) !important;
    }
  }
}

/* ─── Footer ─────────────────────────────────────────── */
.raf-footer {
  background: #0a0b10;
  border-top: 1px solid $border;
  padding: 24px;

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__copy {
    font-size: 0.78rem;
    color: $text-muted;
  }

  &__socials {
    display: flex;
    gap: 8px;
  }

  &__social-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    border: 1px solid $border;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-muted;
    text-decoration: none;
    transition: color 0.2s, border-color 0.2s, background 0.2s;

    &:hover {
      color: $gold;
      border-color: rgba(255,209,102,0.3);
      background: rgba(255,209,102,0.08);
    }
  }
}

/* ─── Responsive footer ──────────────────────────────── */
@media (max-width: 600px) {
  .raf-footer__inner {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
