import type { NavigationGuard } from 'vue-router'
import { useAuthenticationStore } from 'src/modules/authentication/stores/authentication-store';

export const AuthenticatedGuard: NavigationGuard = async (to, from, next) => {
  const store = useAuthenticationStore()
  if(store.isAuthenticated) {
    next()
  } else {
    next({path: '/login'})
  }
}

export default AuthenticatedGuard
