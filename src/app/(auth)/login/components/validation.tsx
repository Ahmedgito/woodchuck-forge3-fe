import {
  isFieldEmpty,
  isValidEmail,
} from '../../../../utils/functions/validation'

interface LoginFormValues {
  email: string
  password: string
}

interface LoginFormErrors {
  email?: string
  password?: string
}

export const validateLoginForm = (values: LoginFormValues): LoginFormErrors => {
  const errors: LoginFormErrors = {}
  if (isFieldEmpty(values.email)) {
    errors.email = 'Please enter email address'
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (isFieldEmpty(values.password)) {
    errors.password = 'Please enter password'
  }
  // else if (!isValidPassword(values.password)) {
  //   errors.password =
  //     "Please enter minimun 8 characters long, contains at least one lowercase letter, one uppercase letter, and one digit";
  // }
  return errors
}
