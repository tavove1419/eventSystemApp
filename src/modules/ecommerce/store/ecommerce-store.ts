import { defineStore } from 'pinia'
import { PlanInterface } from '../interfaces'


export const useEcommerceStore = defineStore('ecommerce', {
  state: () => ({
    data: {} as PlanInterface,
    error: <string | null >null
  }),
  persist: true,
  getters: {},
  actions: {
    async buyTicket(plan: PlanInterface): Promise<void> {
      this.$patch( {
        data: plan
      })
    }
  }
})
