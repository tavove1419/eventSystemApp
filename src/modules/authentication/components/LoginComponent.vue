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
  <q-form class="q-gutter-md">
    <q-input
      filled
      v-model="loginForm.email"
      label="Usuario"
      lazy-rules
      :rules="[(val: []) => val && val.length > 0 || 'El usuario es obligatorio']"
      />

    <q-input
      :type="isPwd ? 'password' : 'text'"
      filled
      v-model="loginForm.password"
      label="Contraseña"
      lazy-rules
      :rules="[(val: []) => val && val.length > 0 || 'la contraseña es obligatoria']"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off': 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>

    <div class="q-gutter-sm row items-center no-wrap justify-center">
      <q-btn label="Login" @click="onLogin()" type="button" color="primary" />
      <q-btn label="Cancelar" to="/" type="button" color="negative" />
    </div>
  </q-form>
</template>

<style scoped lang="scss">

</style>
