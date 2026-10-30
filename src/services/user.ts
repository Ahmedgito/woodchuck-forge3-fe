import { ApiClient } from '.'
import { ROUTES } from '../utils/constants/app-constants'

// Add the following code to src/services/user.ts:
// interfaces for user service

interface verifyAccountPayload {
  password: string
  hash: string
}

interface resetPasswordPayload {
  password: string
  hash: string
}

// user service function

export const verifyAccount = (payload: verifyAccountPayload) => {
  return ApiClient.post(`/v1/users/verifyAccount`, payload, {})
}

export const resetPassword = (payload: resetPasswordPayload) => {
  return ApiClient.post(ROUTES.AUTH + '/reset/password', payload, {})
}

export const getUser = () => {
  return ApiClient.get(ROUTES.AUTH + '/me')
}

export const getClientProfile = (id: number | undefined | null) => {
  return ApiClient.get(ROUTES.USERS + `/${id}`)
}

export const resetUserPassword = (email: string) => {
  return ApiClient.post(ROUTES.AUTH + '/forgot/password', { email: email })
}

export const editUserProfile = (
  id: number,
  values: { [key: string]: string | number }
) => {
  return ApiClient.patchMultipart(ROUTES.USERS + `/${id}`, values)
}

export const getNotifications = (pagination?: number, limit?: number) => {
  if (pagination)
    return ApiClient.get(
      ROUTES.NOTIFICATIONS +
        `?page=${pagination}&sort=[{"orderBy":"updatedAt","order":"desc"}]`
    )
  else {
    return ApiClient.get(
      ROUTES.NOTIFICATIONS +
        `?limit=${limit}&page=1&sort=[{"orderBy":"updatedAt","order":"desc"}]`
    )
  }
}

export const readNotification = (id: number) => {
  return ApiClient.patch(ROUTES.NOTIFICATIONS + `/read/${id}`)
}
