// class API client

import { getSession, signOut } from 'next-auth/react'
import axios from 'axios'
import { authOptions } from '../app/api/auth/[...nextauth]/options'
import {
  getAdminTokenCookie,
  clearAdminTokenCookie,
} from '@/src/utils/cookie-utils'
import { notification } from 'antd'

// Prevent multiple concurrent 401 handlers causing refresh/signout loops
let isSigningOut = false
let isRestoringAdmin = false
let isSessionInvalidNotified = false
const ACCOUNT_CHANGE_LOGOUT_MARKER = 'account-change-logout-warning-at'

// Cache session to avoid multiple getSession calls
let cachedSession = null
let sessionPromise = null

async function getCachedSession() {
  // If there's already a pending session request, wait for it
  if (sessionPromise) {
    return sessionPromise
  }
  
  // Check if cached session is still valid (not expired)
  if (cachedSession) {
    const now = Math.floor(Date.now() / 1000) // Current time in seconds
    const tokenExpires = cachedSession?.token?.tokenExpires
    
    // If token expires within next 60 seconds, refetch session
    // This provides a 60-second buffer before actual expiration
    if (tokenExpires && now < tokenExpires - 60) {
      return cachedSession
    }
    
    // Token expired or about to expire, clear cache
    console.log('⏰ Session token expired or expiring soon, fetching new session')
    cachedSession = null
  }
  
  // Fetch new session and cache it
  sessionPromise = getSession(authOptions)
  cachedSession = await sessionPromise
  sessionPromise = null
  
  return cachedSession
}

// Clear cache when needed
export function clearSessionCache() {
  cachedSession = null
  sessionPromise = null
}

// Request interceptor to add Authorization header
axios.interceptors.request.use(
  async function (config) {
    // Skip adding auth header for auth endpoints
    if (config.url?.includes('/api/auth/')) {
      return config
    }
    
    const session = await getCachedSession()
    if (session?.token?.accessToken) {
      config.headers.Authorization = `Bearer ${session.token.accessToken}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    if (error.response?.status === 401) {
      // Clear session cache on 401
      clearSessionCache()
      const session = await getSession(authOptions)
      const code = error.response?.data?.code

      // 1) If backend explicitly invalidated the session, log out immediately
      if (code === 'SESSION_INVALIDATED') {
        if (!isSessionInvalidNotified && typeof window !== 'undefined') {
          isSessionInvalidNotified = true
          sessionStorage.setItem(
            ACCOUNT_CHANGE_LOGOUT_MARKER,
            String(Date.now())
          )
          notification.destroy()
          notification.error({
            message: 'Error',
            description: 'Your account type changed. Please login again.',
            duration: 4.5,
            placement: 'topRight',
            key: 'session-invalid',
          })
        }
        if (!isSigningOut) {
          isSigningOut = true
          await new Promise((resolve) => setTimeout(resolve, 4500))
          await signOut({ redirect: true, callbackUrl: '/login' })
        }
        return Promise.reject(error)
      }

      // 2) If we have an admin backup token (impersonation), try restoring once; otherwise, logout instantly
      const storedAdminToken = getAdminTokenCookie()
      if (storedAdminToken) {
        try {
          clearAdminTokenCookie()
          if (!isRestoringAdmin && typeof window !== 'undefined') {
            isRestoringAdmin = true
            window.dispatchEvent(
              new CustomEvent('restore-admin-session', {
                detail: storedAdminToken,
              })
            )
          }
          if (!error.config._retry) {
            error.config._retry = true
            return axios.request(error.config)
          }
        } catch (impersonationError) {
          console.error('Failed to restore admin session:', impersonationError)
        }
      }

      // 3) Default: logout immediately on first 401
      if (!isSigningOut) {
        isSigningOut = true
        await signOut({ redirect: true, callbackUrl: '/login' })
      }
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

export class ApiClient {
  static baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://woodchuck-api.folio3.com:7000/api'
  static async get(path, options = {}) {
    const { headers = {}, ...rest } = options

    const config = {
      method: 'get',
      url: this.baseUrl + path,
      headers: {
        ...headers,
      },
      ...rest, // <-- allows responseType, transformResponse, etc.
    }

    return axios.request(config)
  }

  static async post(path, payload, headers = {}) {
    const data = payload
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: this.baseUrl + path,
      headers: {
        ...headers,
      },
      data: data,
    }
    return axios.request(config)
  }

  static async delete(path, payload, headers = {}) {
    let data = payload
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: this.baseUrl + path,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      data: data,
    }
    return axios.request(config)
  }

  static async put(path, payload = {}) {
    let data = JSON.stringify(payload)
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: this.baseUrl + path,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }
    return axios.request(config)
  }

  static async patch(path, payload = {}) {
    let data = JSON.stringify(payload)
    let config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: this.baseUrl + path,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }
    return axios.request(config)
  }

  static async postMultipart(path, payload, headers = {}) {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: this.baseUrl + path,
      headers: {
        ...headers,
      },
      data: payload,
    }
    return axios.request(config)
  }

  static async patchMultipart(path, payload, headers = {}) {
    let config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: this.baseUrl + path,
      headers: {
        ...headers,
      },
      data: payload,
    }
    return axios.request(config)
  }
}
