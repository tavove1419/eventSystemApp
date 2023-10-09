import { defineStore } from 'pinia'
import { PlanInterface } from '../interfaces'


export const useEcommerceStore = defineStore('ecommerce', {
  state: () => ({
    data: {} as PlanInterface[],
    totalBuy: <number>0,
    error: <string | null >null
  }),
  persist: true,
  getters: {},
  actions: {
    async buyTicket(plan: PlanInterface[], total: number): Promise<void> {
      this.$patch( {
        data: plan,
        totalBuy: total
      })
    }
  }
})
