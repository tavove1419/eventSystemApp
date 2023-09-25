import { apiEvents } from 'src/boot/axios'
import { Custommer, PaymentDetailInterface, TicketInterface } from '../interfaces'

export const createCustomer = (dataCustommer: Custommer) => {
    return apiEvents.post('/api/v1/custommer/', dataCustommer)
}

export const findCustommerIdentity = (identity: string) => {
  return apiEvents.get(`/api/v1/custommer/document/${identity}`)
}

export const updateCustommer = (id: string, dataCustommer: Custommer) => {
  return apiEvents.patch(`/api/v1/custommer/${id}`, dataCustommer)
}

export const findOnePaymentCustomer = (identity: string) => {
  return apiEvents.get(`/api/v1/payment-detail/${identity}`)
}

export const createPaymentDetail = (paymentDetail: PaymentDetailInterface) => {
  return apiEvents.post('/api/v1/payment-detail/', paymentDetail)
}

export const updatePaymentDetail = (id: string, paymentDetail: PaymentDetailInterface) => {
  return apiEvents.patch(`/api/v1/payment-detail/${id}`, paymentDetail)
}

export const createTicket = (ticket: TicketInterface) => {
  return apiEvents.post('/api/v1/ticket/', ticket)
}



