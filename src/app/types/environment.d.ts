namespace NodeJS {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface ProcessEnv extends NodeJS.ProcessEnv {
    NEXTAUTH_SECRET: string
    NEXTAUTH_URL: string
    NEXT_PUBLIC_API_URL: string
    NEXTAUTH_DEBUG: boolean
    NEXT_PUBLIC_SOCKET_URL: string
    NEXT_PUBLIC_CLIENT_JOBSITE_ID: string
    NEXT_PUBLIC_DUMPSTER_REFRESH_RATE: string
    NEXT_PUBLIC_ISDEMO: string
    NEXT_PUBLIC_POSTMAN_COLLECTION_URL: string
    NEXT_PUBLIC_POLLING_DURATION_REPORTS: string
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string
  }
}
