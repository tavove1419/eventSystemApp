import { apiEvents } from 'src/boot/axios'
import { AxiosResponse } from 'axios'
import { AuthenticationInterface } from '../interfaces/auth.interface'

export const authentication = (credentials: {email: string, password: string}): Promise<AxiosResponse<AuthenticationInterface>> => {
  return apiEvents.post('/api/v1/authentication/login', credentials)
}
