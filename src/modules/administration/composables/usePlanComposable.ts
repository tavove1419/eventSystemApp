import { apiEvents } from 'src/boot/axios'
import { PlansInterface } from './../interfaces';


export const getAllPlans = () => {
  return apiEvents.get('/api/v1/plan/plans')
}

export const createPlan = (planData: PlansInterface) => {
  delete planData.id
  planData.quantity_number = Number(planData.quantity_number)
  planData.price = Number(planData.price)
  return apiEvents.post('/api/v1/plan', planData)
}

export const updatePlan = (id: string, planData: PlansInterface) => {
  delete planData.id
  planData.quantity_number = Number(planData.quantity_number)
  planData.price = Number(planData.price)
  return apiEvents.patch(`/api/v1/plan/${id}`, planData)
}

export const anactivePlan = (id: string, planData: PlansInterface) => {
  delete planData.id
  planData.quantity_number = Number(planData.quantity_number)
  planData.price = Number(planData.price)
  return apiEvents.put(`/api/v1/plan/${id}`, planData)
}

export const inActivePlan = (id: string, planData: PlansInterface) => {
  delete planData.id
  planData.quantity_number = Number(planData.quantity_number)
  planData.price = Number(planData.price)
  return apiEvents.put(`/api/v1/plan/active/${id}`, planData)
}
