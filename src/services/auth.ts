import { ApiClient } from '.'

interface loginPayload {
  email: string
  password: string
}

interface refreshHeader {
  Authorization: string
}

interface RegistrationPayload {
  username: string
  email: string
  name: string
  company: string
  phone: string
  billingCompanyName?: string
  street?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  role: { id: number | null }
}
interface AutoLoginPayload {
  token: string
}
export const login = (payload: loginPayload) => {
  return ApiClient.post(`/v1/auth/email/login`, payload, {})
}

export const refreshToken = (payload: any, headers: refreshHeader) => {
  return ApiClient.post(`/v1/auth/refresh`, payload, headers)
}

export const verifyToken = (hash: string) => {
  return ApiClient.get(`/v1/auth/reset/verifyToken?hash=${hash}`)
}

export const confirmVerifyToken = (hash: string) => {
  return ApiClient.get(`/v1/users/confirmVerifyToken?hash=${hash}`)
}

export const createUser = (payload: RegistrationPayload) => {
  return ApiClient.post('/v1/auth/email/register-user', payload, {})
}

export const autologinOnPasswordReset = (payload: AutoLoginPayload) => {
  return ApiClient.post(`/v1/auth/autoLogin`, payload, {})
}
