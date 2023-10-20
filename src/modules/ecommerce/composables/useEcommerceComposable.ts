import { apiEvents } from 'src/boot/axios'

export const getEventActive = () => {
  return apiEvents.post('/api/v1/event/eventAct')
}
