import { defineStore } from 'pinia'
import { UserInterface } from 'src/modules/administration/interfaces/user.interface';
import { AppStateInterface } from '../interfaces/app.interface';
import { AuthenticationInterface } from '../interfaces/auth.interface';

const defaultState: AppStateInterface = {
  isAuthenticated: false,
  accesToken: null,
  userInfo: null
}

export const useAuthenticationStore = defineStore('authentication', {
  state: () => Object.assign({}, defaultState),
  persist: true,
  actions: {
    successLogin(loginResponse: AuthenticationInterface) {
      this.$patch({
        accesToken: loginResponse.data.accesToken,
        isAuthenticated: true,
        userInfo: loginResponse.data.user
      })

    },
    logOut() {
      this.$patch({
        ...Object.assign({}, defaultState)
      });
    },
    getUserInfo(userInfo: UserInterface) {
      this.$patch({
        userInfo
      })
    }
  }
})
