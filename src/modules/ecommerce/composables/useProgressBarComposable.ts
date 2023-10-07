import { apiEvents } from 'src/boot/axios'

export const assignedCounter = () => {
  return apiEvents.get('/api/v1/assigned')
}

