import { apiEvents } from 'src/boot/axios'
import { TransferInterface, WinnerInterface } from './../interfaces';


export const getAllWinner = () => {
  return apiEvents.get('/api/v1/winner')
}

export const createWinner = (winnerData: WinnerInterface) => {
  delete winnerData.id
  return apiEvents.post('/api/v1/winner', winnerData)
}

export const updateWinner = (id: string, winnerData: WinnerInterface) => {
  delete winnerData.id
  return apiEvents.patch(`/api/v1/winner/${id}`, winnerData)
}

export const searchWinnerNumber = (number: string, idEvent: string) => {
  return apiEvents.get(`/api/v1/assigned/winner-event/${number}/${idEvent}`)
}

export const registredTransfer = (dataTransfer: TransferInterface) => {
  delete dataTransfer.id
  return apiEvents.post('/api/v1/transfers', dataTransfer)
}

export const registredPaid = (idWinner: string) => {
  return apiEvents.get(`/api/v1/transfers/paid/${idWinner}`)
}
