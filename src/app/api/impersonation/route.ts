import { auth } from '../auth/[...nextauth]/auth'
import { ROUTES } from '@/src/utils/constants/app-constants'

export async function POST(req: Request) {
  try {
    const { targetUserId } = await req.json()
    if (!targetUserId) {
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'targetUserId is required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const isInternalCall = req.headers.get('x-internal-call') === '1'
    const authHeader = req.headers.get('authorization')

    let accessToken: string | null = null
    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.substring('Bearer '.length)
    } else {
      const session = await auth()
      accessToken = session?.token?.accessToken ?? null
    }

    if (!accessToken) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://woodchuck-api.folio3.com:7000/api'

    const backendResponse = await fetch(
      `${apiBaseUrl}${ROUTES.IMPERSONATION}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ targetUserId }),
      }
    )

    const data = await backendResponse.json().catch(() => ({}))

    if (isInternalCall) {
      return new Response(JSON.stringify(data), {
        status: backendResponse.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    let sanitized = data
    if (data?.status === 'success' && data?.data) {
      const { user, originalUserId, impersonationLogId } = data.data
      sanitized = {
        status: 'success',
        data: { user, originalUserId, impersonationLogId },
      }
    }

    return new Response(JSON.stringify(sanitized), {
      status: backendResponse.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ status: 'error', message: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
