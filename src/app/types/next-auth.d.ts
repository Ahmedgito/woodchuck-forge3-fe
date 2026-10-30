// eslint-disable-next-line unused-imports/no-unused-imports
import { Session } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface Session {
    expires: string
    token: {
      accessToken: string
      refreshToken: string
      tokenExpires: number
    }
    user: {
      id: number | null | undefined
      email: string
      name: string | null
      role: any
      isSubUser?: boolean | null
      parentUserId?: number | null
      provider?: string
      socialId?: string | null
      company?: string | null
      billing_details_city?: string | null
      billing_details_country?: string | null
      billing_details_name?: string | null
      billing_details_state?: string | null
      billing_details_street?: string | null
      billing_details_zipcode?: string | null
      status?: {
        id: number
        name: string
      }
      createdAt?: string
      updatedAt?: string
      deletedAt?: string | null
    }
    status?: string
    role?: any
    impersonated?: boolean
    originalUserId?: number | null
    impersonationLogId?: number | null
  }
}
