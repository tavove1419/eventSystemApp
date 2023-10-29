import { apiEvents } from 'src/boot/axios'
import { UserInterface } from '../interfaces/index'
import Crypto from 'src/share/crypto-library/crypto'


const cryptoData = new Crypto()

export const getAllUser = () => {
  return apiEvents.get('/api/v1/user')
}

export const createUser = (dataUser: UserInterface) => {
  delete dataUser.id
  return apiEvents.post('/api/v1/user/', cryptoData.encryptObject(dataUser))
}

export const updateUser = (id: string, dataUser: UserInterface) => {
  delete dataUser.id
  return apiEvents.patch(`/api/v1/user/${id}`, cryptoData.encryptObject(dataUser))
}

export const activeUser = (id: string, dataReferrer: UserInterface) => {
  delete dataReferrer.id
  return apiEvents.put(`/api/v1/user/active/${id}`, cryptoData.encryptObject(dataReferrer))
}

export const inactiveUser = (id: string, dataReferrer: UserInterface) => {
  delete dataReferrer.id
  return apiEvents.put(`/api/v1/user/inactive/${id}`, cryptoData.encryptObject(dataReferrer))
}
