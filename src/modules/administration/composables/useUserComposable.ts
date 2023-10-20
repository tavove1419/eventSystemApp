import { apiEvents } from 'src/boot/axios'
import { UserInterface } from '../interfaces/index'

export const getAllUser = () => {
  return apiEvents.get('/api/v1/user')
}

export const createUser = (dataUser: UserInterface) => {
  delete dataUser.id
  return apiEvents.post('/api/v1/user/', dataUser)
}

export const updateUser = (id: string, dataUser: UserInterface) => {
  delete dataUser.id
  return apiEvents.patch(`/api/v1/user/${id}`, dataUser)
}
