import { apiEvents } from 'src/boot/axios'
import { ReferrerInterface } from '../interfaces'

export const getAllReferrer = () => {
  return apiEvents.get('/api/v1/referrer')
}

export const createReferrer = (dataReferrer: ReferrerInterface) => {
  delete dataReferrer.id
  return apiEvents.post('/api/v1/referrer/', dataReferrer)
}

export const updateReferrer = (id: string, dataReferrer: ReferrerInterface) => {
  delete dataReferrer.id
  return apiEvents.patch(`/api/v1/referrer/${id}`, dataReferrer)
}

export const activeReferrer = (id: string, dataReferrer: ReferrerInterface) => {
  delete dataReferrer.id
  return apiEvents.put(`/api/v1/referrer/active/${id}`, dataReferrer)
}

export const inactiveReferrer = (id: string, dataReferrer: ReferrerInterface) => {
  delete dataReferrer.id
  return apiEvents.put(`/api/v1/referrer/inactive/${id}`, dataReferrer)
}

export const inValidCode = (identity: string, code: string) => {
  return apiEvents.post(`/api/v1/referrer/valid-code/${identity}/${code}`)
}

export const existCode = (code: string) => {
  return apiEvents.post(`/api/v1/referrer/exist-code/${code}`)
}


