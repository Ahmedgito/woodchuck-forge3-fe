'use client'
import ErrorComponent from './component/errors'
import { useSearchParams } from 'next/navigation'
import { MESSAGES } from '@/src/utils/constants/app-constants'

const ErrorPage = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  let title = ''
  let body = ''
  switch (error) {
    case 'reset':
      title = MESSAGES.RESET_PASSWORD
      body = MESSAGES.LINK_EXPIRED
      break
    case 'setup-invalid-link':
      title = MESSAGES.ACCOUNT_SETUP
      body = MESSAGES.INVALID_OR_EXPIRED
      break
    case 'setup-user-exists':
      title = MESSAGES.ACCOUNT_SETUP
      body = MESSAGES.USER_EXISTS
      break
    default:
      title = MESSAGES.ERROR
      body = MESSAGES.INVALID_OR_EXPIRED
  }

  return (
    <>
      <ErrorComponent title={title} body={body} />
    </>
  )
}

export default ErrorPage
