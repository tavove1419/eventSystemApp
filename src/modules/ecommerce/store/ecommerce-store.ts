import { defineStore } from 'pinia'
import { PlanInterface } from '../interfaces'
import { EventInterface } from 'src/modules/administration/interfaces'


export const useEcommerceStore = defineStore('ecommerce', {
  state: () => ({
    data: {} as PlanInterface[],
    activeEvent: {} as EventInterface,
    isActiveEvente: <boolean>false,
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
    },
    async activateEvent(event: EventInterface, isActive: boolean): Promise<void> {
      this.$patch( {
        activeEvent: event,
        isActiveEvente: isActive,
        data: [],
        totalBuy: 0
      })
    },
    async isActive(flat: boolean): Promise<void>{
      this.$patch( {
        isActiveEvente: flat
      })
    }
  }
})
