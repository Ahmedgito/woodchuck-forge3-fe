import { REGEX_CONSTANTS } from '../constants/app-constants'

interface PasswordFormValues {
  password: string
  repeatPassword: string
}

interface PasswordFormErrors {
  password?: string
  repeatPassword?: string
}

export const isFieldEmpty = (str: string) => {
  if (!str && typeof str != 'number') {
    return true
  }
  if (str === '') {
    return true
  }
  try {
    if (str.trim().length < 1) {
      return true
    }
    return false
  } catch {
    return false
  }
}

export const isValidEmail = (str: string) => {
  return REGEX_CONSTANTS.EMAIL.test(str)
}

export const isValidUsername = (str: string) => {
  return REGEX_CONSTANTS.USERNAME.test(str)
}

export const isValidPassword = (str: string) => {
  return REGEX_CONSTANTS.PASSWORD.test(str)
}

export const isValidLength = (str: string, limit: number) => {
  return str.length <= limit
}

export const isValidPhoneNumber = (phoneNumber: string) => {
  return (
    REGEX_CONSTANTS.PHONENUMBER.test(phoneNumber) &&
    phoneNumber.length < 15 &&
    phoneNumber.length > 4
  )
}

export const validatePasswordForm = (
  values: PasswordFormValues
): PasswordFormErrors => {
  const errors: PasswordFormErrors = {}

  if (isFieldEmpty(values.password)) {
    errors.password = 'Please enter password'
  } else if (values.password.includes('-')) {
    errors.password = 'Password cannot contain dashes (-)'
  } else if (!isValidPassword(values.password)) {
    errors.password =
      'Please enter minimun 8 characters long, contains at least one lowercase letter, one uppercase letter, and one digit'
  }
  if (isFieldEmpty(values.repeatPassword)) {
    errors.repeatPassword = 'Please enter Repeat password'
  }
  if (values.password !== values.repeatPassword) {
    errors.repeatPassword = 'Password does not match'
  }
  return errors
}
