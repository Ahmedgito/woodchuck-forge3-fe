import {
  isFieldEmpty,
  isValidEmail,
} from '../../../../utils/functions/validation'

interface ForgotPasswordFormValues {
  email: string
}

interface ForgotPasswordErrors {
  email?: string
}

export const validateForgotPasswordForm = (
  values: ForgotPasswordFormValues
): ForgotPasswordErrors => {
  const errors: ForgotPasswordErrors = {}
  if (isFieldEmpty(values.email)) {
    errors.email = 'Please enter email address'
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address'
  }
  return errors
}
