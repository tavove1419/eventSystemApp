import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { Dialog } from 'quasar'
import { useAuthenticationStore } from 'src/modules/authentication/stores/authentication-store';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const apiEvents = axios.create({ baseURL: process.env.BASE_URL });


export default boot(({ app, router }) => {
  const authStore = useAuthenticationStore();
  apiEvents.interceptors.response.use(
    (res) => res,
    (er: AxiosError) => {
      if (er.response?.status === 401 && er.config?.url !== '/api/v1/authentication/login') {
        Dialog.create({
          title: 'La sesión ha finalizado',
          message:
          (er.response.data as Record<string, string>).message || 'Ha finalizado la sesión',
          html: true,
          ok: {
            color: 'primary',
            label: 'Entendido'
          }
        }).onOk(() => {
          authStore.logOut();
          router.replace('/').catch(() => null)
        });
        return Promise.reject(null)
      } else {
        return Promise.reject(er.response?.data)
      }
    }
  )

  apiEvents.interceptors.request.use((config) => {
    const token = useAuthenticationStore().accesToken || null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  })
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = apiEvents;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { apiEvents };
