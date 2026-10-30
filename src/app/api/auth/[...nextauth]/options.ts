import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'
import { login, refreshToken } from '@services/auth'

// -----------------------------
//  Type Definitions
// -----------------------------
interface TokenInfo {
  accessToken: string
  refreshToken: string
  tokenExpires: number
}

interface SessionUser {
  id: string
  email: string
  name: string
  role: string
  isSubUser?: boolean
  parentUserId?: string | null
}

interface ExtendedToken {
  token: TokenInfo
  user: SessionUser
  status: string
  role: string
  impersonated?: boolean
  originalUserId?: string | null
  impersonationLogId?: string | null
  error?: string
}

// -----------------------------
//  Helper Functions
// -----------------------------

function pickUserFields(u: any): SessionUser {
  return {
    id: u?.id ?? '',
    email: String(u?.email ?? ''),
    name: String(u?.name ?? ''),
    role: u?.role ?? '',
    isSubUser: Boolean(u?.isSubUser),
    parentUserId:
      u?.parentUserId === undefined || u?.parentUserId === null
        ? null
        : u.parentUserId,
  }
}

/**
 * Refresh access token using backend refreshToken API.
 */
async function handleTokenRefresh(
  token: ExtendedToken
): Promise<ExtendedToken> {
  try {
    const payload = {
      impersonated: token.impersonated,
      originalUserId: token.originalUserId,
      impersonationLogId: token.impersonationLogId,
    }

    const headers = {
      Authorization: `Bearer ${token.token.refreshToken}`,
    }

    const response = await refreshToken(payload, headers)
    if (response.data.status === 'success') {
      const data = response.data.data
      return {
        ...token,
        token: {
          accessToken: data.token,
          refreshToken: data.refreshToken,
          tokenExpires: data.tokenExpires,
        },
        user: pickUserFields(data.user), 
      }
    }
  } catch (error) {
    console.error('Token refresh failed:', error)
  }

  return { ...token, error: 'RefreshAccessTokenError' }
}

/**
 * Start impersonation by calling internal API.
 */
async function handleImpersonationStart(
  token: ExtendedToken,
  targetUserId: string
): Promise<ExtendedToken> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/impersonation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-call': '1',
        Authorization: `Bearer ${token.token.accessToken}`,
      },
      body: JSON.stringify({ targetUserId }),
    })

    const data = await res.json()
    if (data?.status === 'success') {
      const tokenData = data.data
      return {
        ...token,
        token: {
          accessToken: tokenData.token,
          refreshToken: tokenData.refreshToken,
          tokenExpires: tokenData.tokenExpires,
        },
        user: pickUserFields(tokenData.user),
        status: 'authenticated',
        role: tokenData.user.role,
        impersonated: true,
        originalUserId: tokenData.originalUserId,
        impersonationLogId: tokenData.impersonationLogId,
      }
    }
  } catch (err) {
    console.error('Impersonation start failed:', err)
  }
  return token
}

/**
 * Stop impersonation by calling internal API.
 */
async function handleImpersonationStop(
  token: ExtendedToken
): Promise<ExtendedToken> {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/impersonation/revert`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-call': '1',
          Authorization: `Bearer ${token.token.accessToken}`,
        },
      }
    )

    const data = await res.json()
    if (data?.status === 'success') {
      const tokenData = data.data
      return {
        ...token,
        token: {
          accessToken: tokenData.token,
          refreshToken: tokenData.refreshToken,
          tokenExpires: tokenData.tokenExpires,
        },
        user: pickUserFields(tokenData.user),
        status: 'authenticated',
        role: tokenData.user.role,
        impersonated: false,
        originalUserId: null,
        impersonationLogId: null,
      }
    }
  } catch (err) {
    console.error('Impersonation stop failed:', err)
  }
  return token
}

// -----------------------------
//  NextAuth Configuration
// -----------------------------
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        autoLoginToken: { label: 'AutoLoginToken', type: 'text' },
      },
      async authorize(credentials) {
        if (credentials?.autoLoginToken) {
          // Validate autoLoginToken via internal Next.js API to avoid exposing backend directly
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/autologin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-internal-call': '1',
            },
            body: JSON.stringify({ token: credentials.autoLoginToken }),
          })

          const data = await res.json()
          if (res.ok && data?.status === 'success') {
            const { user, token, refreshToken, tokenExpires } = data.data
            return {
              id: user.id,
              user: pickUserFields(user),
              token: { accessToken: token, refreshToken, tokenExpires },
              status: 'authenticated',
            }
          }
          throw new Error(data?.message || 'AutoLogin failed')
        }
        if (!credentials) throw new Error('Credentials not provided')

        try {
          const res = await login({
            email: credentials.email,
            password: credentials.password,
          })

          if (res.data.status === 'success') {
            const {
              user,
              token,
              refreshToken: rt,
              tokenExpires,
            } = res.data.data
            return {
              id: user.id,
              user: pickUserFields(user),
              token: {
                accessToken: token,
                refreshToken: rt,
                tokenExpires,
              },
              status: 'authenticated',
            }
          }

          throw new Error(res.data.message || 'Login failed')
        } catch (err) {
          throw new Error('Authentication failed')
        }
      },
    }),
  ],

  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login',
    error: '/login',
    verifyRequest: '/login',
    newUser:
      process.env.NEXT_PUBLIC_ISDEMO === 'true' ? '/create-user' : '/signup',
  },

  callbacks: {
    /**
     * Rebuild session object from JWT
     */
    async session({ session, token }) {
      const t = token as unknown as ExtendedToken
      return {
        ...session,
        token: t.token,
        user: t.user,
        status: t.status,
        role: t.role,
        impersonated: t.impersonated ?? false,
        originalUserId: t.originalUserId ?? null,
        impersonationLogId: t.impersonationLogId ?? null,
      }
    },

    /**
     * Manage JWT lifecycle
     */
    async jwt({ token, user, account, trigger, session: sessionUpdate }: any) {
      let t = token as unknown as ExtendedToken

      // ---- Handle impersonation actions ----
      if (trigger === 'update' && sessionUpdate) {
        if (sessionUpdate.action === 'startImpersonation') {
          return await handleImpersonationStart(t, sessionUpdate.targetUserId)
        }
        if (sessionUpdate.action === 'stopImpersonation') {
          return await handleImpersonationStop(t)
        }

        // General session update
        if (sessionUpdate.token && sessionUpdate.user) {
          return {
            ...t,
            ...sessionUpdate,
            user: pickUserFields(sessionUpdate.user),
          }
        }

        Object.assign(t, sessionUpdate)
        return t
      }

      // ---- On sign-in via credentials ----
      if (trigger === 'signIn' && account?.type === 'credentials' && user) {
        const { user: fullUser, token: tok, status } = user
        return {
          token: tok,
          user: pickUserFields(fullUser),
          status,
          role: fullUser.role,
          impersonated: false,
        }
      }

      // ---- Token refresh ----
      const expiresAt = t?.token?.tokenExpires
      const shouldRefresh = expiresAt && expiresAt - Date.now() < 60 * 60 * 1000

      if (shouldRefresh && t?.token?.refreshToken) {
        return await handleTokenRefresh(t)
      }

      return t
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: String(process.env.NEXTAUTH_DEBUG) === 'true',
}
