import { CREATE_JOB_SITE } from '../constants/types'

export const extractRequiredProperties = (payload: CREATE_JOB_SITE) => {
  const {
    title,
    address,
    name,
    phone,
    email,
    size,
    completionBy,
    clientId,
    sustainabilityGoal,
    powerplants,
    startDate,
    endClientId,
  } = payload

  return {
    title,
    address,
    name,
    phone,
    email,
    size,
    completionBy,
    clientId,
    sustainabilityGoal,
    powerplants,
    startDate,
    endClientId,
  }
}
