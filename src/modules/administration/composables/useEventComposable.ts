import { apiEvents } from 'src/boot/axios'
import { EventInterface } from '../interfaces'

export const getAllEvent = () => {
  return apiEvents.get('/api/v1/event')
}

export const createEvent = (dataEvent: EventInterface) => {
  delete dataEvent.id
  return apiEvents.post('/api/v1/event/', dataEvent)
}

export const updateEvent = (id: string, dataEvent: EventInterface) => {
  delete dataEvent.id
  return apiEvents.patch(`/api/v1/event/${id}`, dataEvent)
}

export const anactiveEvent = (id: string, dataEvent: EventInterface) => {
  delete dataEvent.id
  return apiEvents.put(`/api/v1/event/${id}`, dataEvent)
}

export const inActiveEvent = (id: string, dataEvent: EventInterface) => {
  delete dataEvent.id
  return apiEvents.put(`/api/v1/event/active/${id}`, dataEvent)
}
