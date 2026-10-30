import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js'

export const formatNumber = (phone: string | undefined) => {
  return phone
    ? isValidPhoneNumber(phone)
      ? parsePhoneNumber(phone).formatNational()
      : phone
    : ''
}
