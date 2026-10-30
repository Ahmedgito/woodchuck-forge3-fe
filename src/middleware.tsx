import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { ROLES_ENUM } from '../src/utils/constants/app-constants'

interface RoleType {
  id: number
  name: string
  __entity: string
  enum: string
}

export default withAuth(
  function middleware(request) {
    const token = request.nextauth?.token?.token
    const isDemoEnabled = (process.env.NEXT_PUBLIC_ISDEMO || 'false') === 'true'
    const pathname = request.nextUrl.pathname

    // If no token (not logged in)
    if (!token) {
      // ISDEMO=true: Redirect to /login unless already on an auth route
      if (isDemoEnabled) {
        if (
          !pathname.startsWith('/login') &&
          !pathname.startsWith('/create-user') &&
          !pathname.startsWith('/confirm-email') &&
          !pathname.startsWith('/password-change') &&
          !pathname.startsWith('/forgot-password') &&
          !pathname.startsWith('/error-page') &&
          !pathname.startsWith('/export')
        ) {
          return NextResponse.redirect(new URL('/login', request.url))
        }
      }
      // ISDEMO=false: Redirect to /login unless already on an auth route
      else if (
        !pathname.startsWith('/login') &&
        !pathname.startsWith('/confirm-email') &&
        !pathname.startsWith('/password-change') &&
        !pathname.startsWith('/forgot-password') &&
        !pathname.startsWith('/error-page') &&
        !pathname.startsWith('/export')
      ) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      // Allow the request to proceed if on an auth route
      return NextResponse.next()
    }

    // If logged in, prevent access to auth pages
    if (pathname.startsWith('/login') || pathname.startsWith('/create-user')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Role-based access control
    const role = request.nextauth?.token?.role as RoleType | undefined
    switch (role?.id) {
      case ROLES_ENUM.ADMIN:
        // Admins have full access
        break
      case ROLES_ENUM.POWER_PLANT:
        // Power plants have full access (adjust if needed)
        break
      case ROLES_ENUM.GENERAL_CONTRACTOR:
      case ROLES_ENUM.END_CLIENT:
      case ROLES_ENUM.MANUFACTURER:
      case ROLES_ENUM.OFFTAKE:
      case ROLES_ENUM.CMS:
        // Restrict these roles from /settings
        if (pathname.startsWith('/settings')) {
          return NextResponse.redirect(new URL('/', request.url))
        }
        break
      default:
        // Unknown role: redirect to login (shouldn't happen with valid tokens)
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Allow the request to proceed
    return NextResponse.next()
  },
  {
    callbacks: {
      // Ensure middleware runs only if there's a token to check
      authorized: ({ token }) => !!token || true, // Always run to handle redirects
    },
  }
)

export const config = {
  matcher: [
    // Apply to all routes except static assets and API
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
}
