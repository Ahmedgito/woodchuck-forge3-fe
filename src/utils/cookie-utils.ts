// Shared cookie utility functions for admin token storage
const ADMIN_TOKEN_COOKIE = 'admin-token-backup'
const COOKIE_EXPIRY_DAYS = 1 // Admin token backup expires in 1 day

export const setAdminTokenCookie = (tokenData: any) => {
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS)

  const cookieValue = JSON.stringify({
    ...tokenData,
    expires: expiryDate.toISOString(),
  })

  document.cookie = `${ADMIN_TOKEN_COOKIE}=${encodeURIComponent(cookieValue)}; expires=${expiryDate.toUTCString()}; path=/; secure; samesite=strict`
}

export const getAdminTokenCookie = () => {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split(';')
  const adminCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${ADMIN_TOKEN_COOKIE}=`)
  )

  if (!adminCookie) return null

  try {
    const cookieValue = decodeURIComponent(adminCookie.split('=')[1])
    const tokenData = JSON.parse(cookieValue)

    // Check if token has expired
    if (new Date() > new Date(tokenData.expires)) {
      clearAdminTokenCookie()
      return null
    }

    return tokenData
  } catch (error) {
    console.error('Failed to parse admin token cookie:', error)
    clearAdminTokenCookie()
    return null
  }
}

export const clearAdminTokenCookie = () => {
  document.cookie = `${ADMIN_TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
