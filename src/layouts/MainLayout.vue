<template>
  <div>
    <q-layout view="hHh Lpr lff">
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title class="user-name text-right">
          </q-toolbar-title>
          <div class="q-pr-xs">
            <q-btn round flat icon="ion-log-out" to="/" @click="logout">
              <q-tooltip>Cerrar sesión</q-tooltip>
            </q-btn>
          </div>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :mini="miniState"
        @mouseover="miniState = false"
        @mouseout="miniState = true"
        :width="200"
        :breakpoint="500"
        bordered
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      >
        <q-scroll-area class="fit">
          <q-list bordered class="rounded-borders">
            <q-item
              v-if="isAdmin"
              clickable
              v-ripple
              :to="{ name: 'Dashboard' }"
              exact
            >
              <q-item-section avatar class="avatar-menu">
                <q-icon name="home" />
              </q-item-section>
              <q-item-section> Inicio </q-item-section>
            </q-item>
            <q-separator />
            <q-item
              v-if="isAdmin"
              clickable
              v-ripple
              :to="{ name: 'User' }"
              exact
            >
              <q-item-section avatar class="avatar-menu">
                <q-icon name="person" />
              </q-item-section>
              <q-item-section> Usuarios </q-item-section>
            </q-item>
            <q-separator />
            <q-item
              v-if="isAdmin"
              clickable
              v-ripple
              :to="{ name: 'Referrer' }"
              exact
            >
              <q-item-section avatar class="avatar-menu">
                <q-icon name="touch_app" />
              </q-item-section>
              <q-item-section> Usuario Referenciador </q-item-section>
            </q-item>
            <q-separator />
            <q-item
              v-if="isAdmin"
              clickable
              v-ripple
              :to="{ name: 'Event' }"
              exact
            >
              <q-item-section avatar class="avatar-menu">
                <q-icon name="article" />
              </q-item-section>
              <q-item-section> Eventos </q-item-section>
            </q-item>
            <q-separator />
            <q-item
              v-if="isAdmin"
              clickable
              v-ripple
              :to="{ name: 'Plan' }"
              exact
            >
              <q-item-section avatar class="avatar-menu">
                <q-icon name="theaters" />
              </q-item-section>
              <q-item-section> Planes </q-item-section>
            </q-item>
            <q-item
              v-if="isAdmin"
              clickable
              v-ripple
              :to="{ name: 'Winner' }"
              exact
            >
              <q-item-section avatar class="avatar-menu">
                <q-icon name="emoji_events" />
              </q-item-section>
              <q-item-section> Registro Ganadores </q-item-section>
            </q-item>
          </q-list>
          <div class="switch-dark-mode text-center">
            <q-toggle
              v-model="isDarkMode"
              color="primary"
              @update:model-value="$q.dark.toggle()"
              :label="!miniState ? 'Modo oscuro' : ''"
              left-label
            />
          </div>
        </q-scroll-area>
      </q-drawer>

      <q-page-container class="absolute full-width full-height">
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { useQuasar } from 'quasar';
import { useAuthenticationStore } from 'src/modules/authentication/stores/authentication-store';

const $q = useQuasar();
const store = useAuthenticationStore();
const isDarkMode = ref<boolean>($q.dark.mode as boolean);
const isAdmin = true;
const drawer = ref(false);
const miniState = ref(true);

function logout(): void {
  store.logOut()
}
</script>

<style lang="scss">
.q-item.q-router-link--active,
.q-item--active {
  color: #00cbfb !important;
}

.user-name {
  font-size: 14px;
  opacity: 80%;
}

.logo-title {
  height: 40px;
}

.q-item__section--avatar {
  min-width: 30px !important;
}

.q-item__section--side {
  padding-right: 5px;
}

.q-expansion-item__content > .q-list {
  > .q-item {
    padding-left: 40px;
  }

  > .q-expansion-item > .q-expansion-item__container {
    padding-left: 24px;
  }
}

.q-item {
  min-height: 40px;
}

.q-expansion-item__content > .q-item > .q-item__section--main {
  margin-left: 30px;
  display: list-item;
}

.q-expansion-item--expanded {
  background-color: #c7c7c7;
}

// Dark Mode

.q-scrollarea--dark {
  background-color: #172d69;
  color: white;
}

.switch-dark-mode {
  position: sticky;
  top: 90%;
  opacity: 60%;
}

.q-toggle--dark .q-toggle__inner--truthy {
  color: white !important;
}
</style>
