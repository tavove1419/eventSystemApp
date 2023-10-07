import { apiEvents } from 'src/boot/axios'
//import { PlanInterface } from './../interfaces/index'

export const getAllPlan = () => {
  return apiEvents.get('/api/v1/plan')
}

